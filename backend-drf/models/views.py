from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import MLModel
from .serializers import MLModelSerializer
import os
import numpy as np
import tensorflow as tf
import torch
import pickle
import logging


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
    def post(self, request, pk):
        try:
            model_obj = MLModel.objects.get(pk=pk, user=request.user)
        except MLModel.DoesNotExist:
            return Response(
                {"detail": "Model not found or not owned by user."},
                status=status.HTTP_404_NOT_FOUND
            )

        input_data = request.data.get('input_data')
        if not input_data or not isinstance(input_data, list):
            return Response(
                {"detail": "Invalid input_data. Must be a list."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            input_array = np.array(input_data, dtype=np.float32)
            model_path = model_obj.file.path
            framework = model_obj.framework

            if framework == 'tensorflow':
                model = tf.keras.models.load_model(model_path)
                predictions = model.predict(input_array.reshape(1, -1))
                predictions = predictions.tolist()

            elif framework == 'pytorch':
                model = torch.load(model_path, map_location=torch.device('cpu'))
                model.eval()
                with torch.no_grad():
                    input_tensor = torch.tensor(input_array, dtype=torch.float32).reshape(1, -1)
                    predictions = model(input_tensor).numpy().tolist()

            elif framework == 'sklearn':
                with open(model_path, 'rb') as f:
                    model = pickle.load(f)
                predictions = model.predict(input_array.reshape(1, -1)).tolist()

            else:
                return Response(
                    {"detail": "Unsupported framework."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            return Response({"predictions": predictions}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error executing model {model_obj.name}: {str(e)}")
            return Response(
                {"detail": f"Error executing model: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )