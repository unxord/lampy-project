from rest_framework import serializers
from .models import MainContentItem

class MainContentItemSerializer(serializers.ModelSerializer):
    content_type_display = serializers.CharField(source='get_content_type_display', read_only=True)

    class Meta:
        model = MainContentItem
        fields = [
            'id',
            'title',
            'content',
            'content_type',
            'content_type_display',
            'read_more_link',
            'order',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at', 'content_type_display']