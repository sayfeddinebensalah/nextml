from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    # Base API Endpoint
    path('api/v1/', include('api.urls')),
    # Include models app URLs
    path('api/v1/models/', include('models.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)