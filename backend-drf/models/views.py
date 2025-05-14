from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import MLModel
from .serializers import MLModelSerializer, ExecuteModelSerializer
import os
import numpy as np
import tensorflow as tf
import torch
import joblib  # ✅ Use this for sklearn
import logging
import pandas as pd
from PIL import Image
import librosa

from mlaas_main.pytorch_models import SimpleNN  # ✅ import your PyTorch model

logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)


class ModelUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = MLModelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ModelListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        models = MLModel.objects.filter(user=request.user)
        serializer = MLModelSerializer(models, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ModelDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            model = MLModel.objects.get(pk=pk, user=request.user)
            model.file.delete()
            model.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except MLModel.DoesNotExist:
            return Response(
                {"detail": "Model not found or not owned by user."},
                status=status.HTTP_404_NOT_FOUND
            )


class ModelExecuteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ExecuteModelSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        model_id = serializer.validated_data['model_id']
        input_file = serializer.validated_data['input_data']

        try:
            model_obj = MLModel.objects.get(pk=model_id, user=request.user)
        except MLModel.DoesNotExist:
            return Response(
                {"detail": "Model not found or not owned by user."},
                status=status.HTTP_404_NOT_FOUND
            )

        file_extension = input_file.name.split('.')[-1].lower()
        try:
            if file_extension == 'xlsx':
                data = pd.read_excel(input_file).values.flatten()
            elif file_extension in ['jpg', 'jpeg', 'png']:
                image = Image.open(input_file)
                data = np.array(image).flatten()
            elif file_extension in ['wav', 'mp3']:
                audio, sr = librosa.load(input_file, sr=None)
                if audio.shape[0] < 4:
                    audio = np.pad(audio, (0, 4 - audio.shape[0]))
                elif audio.shape[0] > 4:
                    audio = audio[:4]
                data = audio
            else:
                return Response({"detail": "Unsupported file type"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error processing file for model {model_obj.name}: {str(e)}")
            return Response({"detail": f"Error processing file: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            input_array = np.array(data, dtype=np.float32)
        except Exception as e:
            logger.error(f"Error converting data for model {model_obj.name}: {str(e)}")
            return Response({"detail": f"Invalid input data after processing: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        expected_input_shape = 4
        if input_array.shape[0] != expected_input_shape:
            return Response(
                {"detail": f"Invalid input shape: model expects {expected_input_shape} features, but got {input_array.shape[0]}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            model_path = model_obj.file.path
            framework = model_obj.framework

            if framework == 'tensorflow':
                model = tf.keras.models.load_model(model_path)
                predictions = model.predict(input_array.reshape(1, expected_input_shape)).tolist()

            elif framework == 'pytorch':
                model = SimpleNN()
                model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
                model.eval()
                with torch.no_grad():
                    input_tensor = torch.tensor(input_array, dtype=torch.float32).reshape(1, -1)
                    predictions = model(input_tensor).numpy().tolist()

            elif framework == 'sklearn':
                # ✅ Use joblib to load sklearn model
                model = joblib.load(model_path)
                predictions = model.predict(input_array.reshape(1, -1)).tolist()

            else:
                return Response({"detail": "Unsupported framework."}, status=status.HTTP_400_BAD_REQUEST)

            return Response({"predictions": predictions}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error executing model {model_obj.name}: {str(e)}")
            return Response({"detail": f"Error executing model: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
