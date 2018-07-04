from rest_framework import serializers

from .models import Post
from users.serializers import UserSerializer


class PostsSerializer(serializers.ModelSerializer):
    author = UserSerializer()

    class Meta:
        model = Post
        fields = ('id', 'title', 'author', 'media', 'description', 'created', 'category')
        read_only_fields = ('author', 'id',)


class PostCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post
        exclude = ('id',)
        read_only_fields = ('author',)


class PostWithLikeSerializer(serializers.ModelSerializer):
    author = UserSerializer()

    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ('author', 'id',)

