from rest_framework.generics import ListCreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import FormParser, MultiPartParser, FileUploadParser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q

from .serializers import PostsSerializer, PostCreateSerializer, PostWithLikeSerializer
from .models import Post, Like
from .permissions import IsPremiumOrReadOnly
from .filters import PostFilter

from django.contrib.auth import get_user_model

User = get_user_model()


class PostFromFollow(ListAPIView):
    permission_classes = (IsPremiumOrReadOnly,)
    filter_class = PostFilter
    serializer_class = PostWithLikeSerializer

    def get_queryset(self):
        param = self.request.GET.get('order', None)
        qs = self.request.user.following.all()
        if param is not None:
            return Post.objects.filter(
                Q(author__in=qs) |
                Q(author=self.request.user))\
                .select_related('author')\
                .order_by(param)
        return Post.objects.filter(
            Q(author__in=qs) |
            Q(author=self.request.user))\
            .select_related('author')\
            .order_by('-created')


class AllPostAPIView(ListCreateAPIView):
    permission_classes = (IsPremiumOrReadOnly,)
    filter_class = PostFilter
    parser_classes = (FormParser, MultiPartParser, FileUploadParser,)

    def get_queryset(self):
        param = self.request.GET.get('order', None)
        if param is not None:
            return Post.objects.all().select_related('author').order_by(param)
        return Post.objects.all().select_related('author').order_by('-created')

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return PostWithLikeSerializer
        else:
            return PostCreateSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def like_post(request):
    user = request.user
    data = request.data.get('id', None)

    if data is None:
        return Response({'detail': 'Nie podano właściwego id'}, 400)

    if not Post.objects.filter(id=data).exists():
        return Response({'detail': 'Post nie istnieje'}, 404)

    data = Post.objects.get(id=data)

    like = Like.objects.filter(post=data, user=user)
    if like.exists():
        like.delete()
        serializer = PostWithLikeSerializer(data)
        return Response(serializer.data, 200)
    else:
        Like.objects.create(post=data, user=user)
        serializer = PostWithLikeSerializer(data)
        return Response(serializer.data, 201)
