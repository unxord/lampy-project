from django.urls import path
from .views import CommonContentListView, RegisterView

urlpatterns = [
    path('getcontent/<str:page_name>/', CommonContentListView.as_view(), name='get_content_by_page'),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
]