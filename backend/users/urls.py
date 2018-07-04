from django.urls import path, include
from rest_auth.urls import LoginView, UserDetailsView, PasswordChangeView
import rest_auth.registration.urls

from .views import UserListAPIView, UserRetrieveAPIView, LogoutView, FollowingAPIView


urlpatterns = [
    path('', UserListAPIView.as_view(), name='User_List'),
    path('me/', UserDetailsView.as_view()),

    path('follow', FollowingAPIView.as_view(), name='follow'),

    path('registration/', include('rest_auth.registration.urls')),

    path('login/', LoginView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('me/password/change/', PasswordChangeView.as_view()),
    path('<username>/', UserRetrieveAPIView.as_view(), name='User_Detail_Update'),

]
