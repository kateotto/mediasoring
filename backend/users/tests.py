from rest_framework.test import APIClient, APITestCase
from django.contrib.auth import get_user_model
from rest_framework_jwt.settings import api_settings
from .models import Follow

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

User = get_user_model()


class UserAPITest(APITestCase):
    """
    api/users/login/
    api/users/logout/
    api/users/me/
    api/users/<username>/
    api/users/follow
    """

    @classmethod
    def setUpClass(cls):
        return super().setUpClass()

    def setUp(self):
        self._USER_DATA = {'username': 'TestUser1', 'password': 'password123'}

        self.user = User.objects.create_user(**self._USER_DATA)
        User.objects.create_user(username='TestUser2', password='qaz123', is_premium_user=True)

        payload = jwt_payload_handler(self.user)
        self.token = jwt_encode_handler(payload)

        self.user_client = APIClient()

    def _login(self):
        self.user_client.login(**self._USER_DATA)

    def test_login(self):
        response = self.user_client.post('/api/users/login/', data=self._USER_DATA)
        
        self.assertEqual(response.status_code, 200)
        self.assertDictEqual(response.json(), {'token': self.token,
                                               'user': {'id': 1,
                                                        'username': 'TestUser1',
                                                        'email': '',
                                                        'avatar': 'http://testserver/media/default-user.jpg',
                                                        'first_name': '',
                                                        'last_name': '',
                                                        'date_of_birth': None,
                                                        'is_premium_user': False,
                                                        'about': None,
                                                        'followers': []}})

    def test_logout(self):
        self._login()
        response = self.user_client.post('/api/users/logout/')

        self.assertEqual(response.status_code, 200)

    def test_user_me_success(self):
        self.user_client.force_authenticate(user=self.user, token=self.token)
        response = self.user_client.get('/api/users/me/')

        self.assertEqual(200, response.status_code)
        self.assertDictEqual(response.json(), {'id': 1,
                                               'username': 'TestUser1',
                                               'email': '',
                                               'avatar': 'http://testserver/media/default-user.jpg',
                                               'first_name': '',
                                               'last_name': '',
                                               'date_of_birth': None,
                                               'is_premium_user': False,
                                               'about': None,
                                               'followers': []})

    def test_user_detail_success(self):
        response = self.user_client.get('/api/users/TestUser1/')

        self.assertEqual(200, response.status_code)
        self.assertDictEqual(response.json(), {'id': 1,
                                               'username': 'TestUser1',
                                               'email': '',
                                               'avatar': 'http://testserver/media/default-user.jpg',
                                               'first_name': '',
                                               'last_name': '',
                                               'date_of_birth': None,
                                               'is_premium_user': False,
                                               'about': None,
                                               'followers': []})

    def test_user_detail_fail(self):
        response = self.user_client.get('/api/users/nonexistuser/')

        self.assertEqual(404, response.status_code)

    def test_send_follow_fail_user_non_exist(self):
        self.user_client.force_authenticate(user=self.user)
        response = self.user_client.post('/api/users/follow', data={'user_to': 999})

        self.assertEqual(404, response.status_code)

    def test_send_follow_fail_user_bad_value(self):
        self.user_client.force_authenticate(user=self.user)
        response = self.user_client.post('/api/users/follow', data={'user_to': 'bad_value'})

        self.assertEqual(400, response.status_code)

    """
    def test_send_follow_fail_follow_self(self):
        self.user_client.force_authenticate(user=self.user)
        response = self.user_client.post('/api/users/follow', data={'user_to': self.user.id})

        self.assertEqual(403, response.status_code)
    """

    def test_send_follow_success(self):
        self.user_client.force_authenticate(user=self.user)
        response = self.user_client.post('/api/users/follow', data={'user_to': 2})

        self.assertEqual(201, response.status_code)

    def test_send_follow_unfollow(self):
        self.user_client.force_authenticate(user=self.user)
        Follow.objects.create(user_from=self.user, user_to=User.objects.get(id=2))

        response = self.user_client.post('/api/users/follow', data={'user_to': 2})
        self.assertEqual(200, response.status_code)
