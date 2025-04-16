from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import CommonContentItem
from .serializers import CommonContentItemSerializer

class CommonContentListView(generics.ListAPIView):
    serializer_class = CommonContentItemSerializer
    permission_classes = [AllowAny]

    allowed_pages = [choice[0] for choice in CommonContentItem.PageType.choices]

    def get_queryset(self):
        page_name = self.kwargs.get('page_name', None)

        if page_name and page_name in self.allowed_pages:
            return CommonContentItem.objects.filter(page=page_name).order_by('-created_at')
        else:
            return CommonContentItem.objects.none()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        page_name = self.kwargs.get('page_name', None)
        if not page_name or page_name not in self.allowed_pages:
             return Response(
                 {"detail": f"Страница '{page_name}' не найдена или недопустима."},
                 status=status.HTTP_404_NOT_FOUND
             )

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)