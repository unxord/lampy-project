from django.urls import path
from .views import CommonContentListView

urlpatterns = [
    path('getcontent/<str:page_name>/', CommonContentListView.as_view(), name='get_content_by_page'),
]