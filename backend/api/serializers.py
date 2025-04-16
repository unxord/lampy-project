from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import CommonContentItem

User = get_user_model()

class CommonContentItemSerializer(serializers.ModelSerializer):
    display_author = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CommonContentItem
        fields = [
            'id',
            'page',
            'title',
            'content',
            'read_more_link',
            'display_author',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'display_author', 'created_at', 'updated_at']

    def get_display_author(self, obj):
        if obj.author_pseudonym:
            return obj.author_pseudonym
        elif obj.author:
            return obj.author.username
        return None