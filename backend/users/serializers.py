from rest_framework.serializers import ModelSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ('username', 'avatar', 'is_premium_user')


class UserDetailsSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'avatar',
                  'date_of_birth', 'first_name', 'last_name',
                  'is_premium_user', 'about', 'followers')
        read_only_fields = ('username', 'id')


