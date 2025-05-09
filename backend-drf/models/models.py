from django.db import models
from django.contrib.auth.models import User

class MLModel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='models/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    framework = models.CharField(max_length=50, choices=[
        ('tensorflow', 'TensorFlow'),
        ('pytorch', 'PyTorch'),
        ('sklearn', 'Scikit-learn'),
    ])

    def __str__(self):
        return f"{self.name} ({self.user.username})"