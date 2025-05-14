from rest_framework import serializers
from .models import MLModel

class MLModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = MLModel
        fields = ['id', 'name', 'file', 'framework', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']

class ExecuteModelSerializer(serializers.Serializer):
    model_id = serializers.IntegerField()
    input_data = serializers.FileField()