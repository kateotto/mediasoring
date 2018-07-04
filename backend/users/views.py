from rest_framework.generics import RetrieveAPIView, RetrieveUpdateAPIView, ListAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.renderers import JSONRenderer
from rest_framework.decorators import api_view, APIView
from rest_framework.response import Response

from .serializers import UserSerializer, UserDetailsSerializer
from .models import User, Follow
from .permissions import IsOwnerOrReadOnly

from rest_auth.views import LogoutView


class LogoutAPIView(LogoutView):
    permission_classes = (IsAuthenticated,)


class UserListAPIView(ListAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        return User.premium.all()


class UserRetrieveAPIView(RetrieveUpdateAPIView):
    serializer_class = UserDetailsSerializer
    permission_classes = (IsOwnerOrReadOnly,)
    lookup_field = 'username'

    def get_queryset(self):
        return User.objects.all()


class FollowingAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return self.request.user.following.all()

    def get(self, request):
        qs = self.get_queryset()
        serializer = UserSerializer(qs, many=True)
        return Response({'following': serializer.data}, 200)

    def post(self, request):
        user_from = request.user
        user_to = request.data.get('user_to', None)

        if user_to is None:
            return Response({'detail': 'Nie podano właściwego id'}, 400)

        try:
            user_to = int(user_to)
        except ValueError:
            return Response({'detail': 'Nie podano właściwego id'}, 400)

        if user_to == user_from.id:
            return Response({'detail': 'Nie można obserwować samego siebie'}, 403)

        user_to = User.objects.filter(id=user_to)
        if not user_to.exists():
            return Response({'detail': 'Użytkownik o podanym id nie istnieje'}, 404)

        user_to = user_to.get()

        follow = Follow.objects.filter(user_from=user_from, user_to=user_to)
        if follow.exists():
            follow.delete()
            return Response({}, 200)
        else:
            Follow.objects.create(user_to=user_to, user_from=user_from)
            return Response({}, 201)
