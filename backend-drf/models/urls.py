from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.ModelUploadView.as_view(), name='model-upload'),
    path('', views.ModelListView.as_view(), name='model-list'),
    path('<int:pk>/', views.ModelDeleteView.as_view(), name='model-delete'),
    path('execute/', views.ModelExecuteView.as_view(), name='model-execute'),
]