from django.urls import path
from .views import ModelUploadView, ModelListView, ModelDeleteView, ModelExecuteView

urlpatterns = [
    path('upload/', ModelUploadView.as_view(), name='model-upload'),
    path('', ModelListView.as_view(), name='model-list'),
    path('<int:pk>/', ModelDeleteView.as_view(), name='model-delete'),
    path('<int:pk>/execute/', ModelExecuteView.as_view(), name='model-execute'),
]