from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache
from django.conf import settings
from .models import CommonContentItem
from .serializers import CommonContentItemSerializer
from django.contrib.auth import get_user_model

from .models import CommonContentItem
from .serializers import CommonContentItemSerializer, RegisterSerializer

User = get_user_model()
CACHE_TTL = getattr(settings, 'CONTENT_CACHE_TTL', 60 * 15)

class CommonContentListView(generics.ListAPIView):
    serializer_class = CommonContentItemSerializer
    permission_classes = [AllowAny]

    allowed_pages = [choice[0] for choice in CommonContentItem.PageType.choices]

    def get_queryset(self):
        page_name = self.kwargs.get('page_name', None)
        if page_name and page_name in self.allowed_pages:
            return CommonContentItem.objects.filter(page=page_name).order_by('-created_at')
        else:
            return None

    def list(self, request, *args, **kwargs):
        page_name = self.kwargs.get('page_name', None)
        if not page_name or page_name not in self.allowed_pages:
             return Response(
                 {"detail": f"Страница '{page_name}' не найдена или недопустима."},
                 status=status.HTTP_404_NOT_FOUND
            )

        page_query_param = self.paginator.page_query_param if self.paginator else 'page'
        try:
            page_number = int(request.query_params.get(page_query_param, '1'))
            if page_number < 1:
                page_number = 1
        except ValueError:
            page_number = 1

        cache_key = f"content_list_{page_name}_page_{page_number}"
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data)

        queryset = self.get_queryset()
        if queryset is None:
             return Response(
                 {"detail": f"Проблема при получении queryset для страницы '{page_name}'."},
                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
             )

        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response = self.get_paginated_response(serializer.data)

            cache.set(cache_key, response.data, timeout=CACHE_TTL)

            return response
        else:
            serializer = self.get_serializer(queryset, many=True)
            response_data = serializer.data
            cache.set(cache_key, response_data, timeout=CACHE_TTL)
            return Response(response_data)
        
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "user": {
                    "username": user.username,
                    "email": user.email,
                 },
                "message": "Пользователь успешно зарегистрирован. Пожалуйста, войдите."
            },
            status=status.HTTP_201_CREATED
        )