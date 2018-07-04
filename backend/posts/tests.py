from datetime import datetime

from rest_framework.test import APIClient, APITestCase
from django.contrib.auth import get_user_model
from rest_framework_jwt.settings import api_settings

from .models import Post, Like
from users.models import Follow


jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

User = get_user_model()

USERS_LIST = [
    {'username': 'TestUser1', 'email': '', 'is_premium_user': True},
    {'username': 'TestUser2', 'email': '', 'is_premium_user': False},
    ]

TEST_POSTS = [
    {'id': 1, 'title': 'Test Post 1', 'description': 'Test Post 1', 'category': 'IT'},
    {'id': 2, 'title': 'Test Post 2', 'description': 'Test Post 2', 'category': 'IT'},
    {'id': 3, 'title': 'Test Post 3', 'description': 'Test Post 3', 'category': 'Sport'},
    {'id': 4, 'title': 'Test Post 4', 'description': 'Test Post 4', 'category': 'IT'},
    {'id': 5, 'title': 'Test Post 5', 'description': 'Test Post 5', 'category': 'Fashion'}
    ]


class PostAPITest(APITestCase):

    @classmethod
    def setUpClass(cls):
        return super().setUpClass()

    def setUp(self):

        self.user_premium = User.objects.create_user(**USERS_LIST[0], password="qaz123")
        self.user_normal = User.objects.create_user(**USERS_LIST[1], password="123qaz")

        Follow.objects.create(user_from=self.user_normal, user_to=self.user_premium, created=datetime.now())

        payload_premium = jwt_payload_handler(self.user_premium)
        self.token_premium = jwt_encode_handler(payload_premium)

        payload_normal = jwt_payload_handler(self.user_normal)
        self.token_normal = jwt_encode_handler(payload_normal)

        self.client_premium = APIClient()
        self.client_normal = APIClient()

        for test_post in TEST_POSTS:
            Post.objects.create(**test_post, author=self.user_premium)

    def _login(self):
        self.client_premium.login(username='TestUser1', password='qaz123')
        self.client_premium.login(username='TestUser2', password='123qaz')

    def test_post_list(self):
        response = self.client_normal.get('/api/posts/')

        self.assertEqual(response.status_code, 200)

    def test_post_list_filter(self):
        response = self.client_normal.get('/api/posts/?category=IT')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 3)

    def test_add_post_success(self):

        data = {
            'title': 'Test',
            'author': self.user_premium,
            'category': 'IT',
            'description': 'Test Test Test'
        }

        self.client_premium.force_authenticate(user=self.user_premium)
        response = self.client_premium.post('/api/posts/', data=data)
        self.assertEqual(response.status_code, 201)

    def test_add_post_fail_missing_title(self):

        data = {
            'title': '',
            'author': self.user_premium,
            'category': 'IT',
            'description': 'Test Test Test'
        }

        self.client_premium.force_authenticate(user=self.user_premium)
        response = self.client_premium.post('/api/posts/', **data)

        self.assertEqual(response.status_code, 400)

    def test_add_post_fail_unauthorized(self):

        data = {
            'title': 'Test',
            'author': self.user_premium,
            'category': 'IT',
            'description': 'Test Test Test'
        }

        response = self.client_premium.post('/api/posts/', data)

        self.assertEqual(response.status_code, 401)

    def test_add_post_fail_nonpremium(self):

        data = {
            'title': 'Test',
            'author': self.user_normal,
            'category': 'IT',
            'description': 'Test Test Test'
        }
        self.client_normal.force_authenticate(user=self.user_normal)
        response = self.client_normal.post('/api/posts/', data)

        self.assertEqual(response.status_code, 403)

    def test_send_like_success(self):
        self.client_normal.force_authenticate(user=self.user_normal)
        response = self.client_normal.post('/api/posts/like', data={'id': 1})

        self.assertEqual(201, response.status_code)

    def test_send_dislike_success(self):
        self.client_normal.force_authenticate(user=self.user_normal)
        Like.objects.create(user=self.user_normal, post=Post.objects.get(id=1))
        response = self.client_normal.post('/api/posts/like', data={'id': 1})

        self.assertEqual(200, response.status_code)

    def test_send_follow_fail_nonexist(self):
        self.client_normal.force_authenticate(user=self.user_normal)
        response = self.client_normal.post('/api/posts/like', data={'id': 1901})

        self.assertEqual(404, response.status_code)

    def test_send_follow_fail_bad_key(self):
        self.client_normal.force_authenticate(user=self.user_normal)
        response = self.client_normal.post('/api/posts/like', data={'bad_key': 1})

        self.assertEqual(400, response.status_code)
