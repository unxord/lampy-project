from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MainContentViewSet

router = DefaultRouter()
router.register(r'maincontent', MainContentViewSet, basename='maincontent')

urlpatterns = [
    path('', include(router.urls)),
]