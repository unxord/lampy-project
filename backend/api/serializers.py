from rest_framework import serializers
from django.contrib.auth import get_user_model

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError

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
    
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        label="Подтвердите пароль",
        style={'input_type': 'password'}
    )
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True, max_length=150)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Пароли не совпадают."})

        if User.objects.filter(email=attrs['email']).exists():
             raise serializers.ValidationError({"email": "Пользователь с таким email уже существует."})

        if User.objects.filter(username=attrs['username']).exists():
             raise serializers.ValidationError({"username": "Пользователь с таким логином уже существует."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])
        user.save()

        return user