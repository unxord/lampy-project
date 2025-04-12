from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import MainContentItem
from .serializers import MainContentItemSerializer

class MainContentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MainContentItem.objects.all()
    serializer_class = MainContentItemSerializer
    permission_classes = [AllowAny]