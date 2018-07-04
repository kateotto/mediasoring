from django.urls import path

from .views import PostFromFollow, AllPostAPIView, like_post


urlpatterns = [
    path('', AllPostAPIView.as_view()),
    path('following', PostFromFollow.as_view()),
    path('like', like_post)
]
