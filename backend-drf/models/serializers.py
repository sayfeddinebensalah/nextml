from rest_framework import serializers
from .models import MLModel

class MLModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = MLModel
        fields = ['id', 'name', 'file', 'framework', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']