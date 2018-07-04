from datetime import datetime

from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models

from mediasoring.validators import FileValidator


class PremiumUserManager(models.Manager):

    def get_queryset(self):
        return super(PremiumUserManager, self).get_queryset()\
                                             .filter(is_premium_user=True)


def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/<username>/<filename>
    return '{0}/{1}'.format(instance.username, filename)


class User(AbstractUser):

    USERNAME_FIELD = 'username'

    username = models.CharField(max_length=20, unique=True)
    avatar = models.FileField(null=True, blank=True,
                              validators=[
                                  FileValidator(allowed_extensions=('jpg', 'JPEG'),
                                                max_size=5*1024*1024)
                              ],
                              upload_to=user_directory_path,
                              default='default-user.jpg')
    date_of_birth = models.DateField(null=True, blank=True)
    is_premium_user = models.BooleanField(default=False)
    following = models.ManyToManyField('self', through='Follow',
                                       related_name='followers',
                                       symmetrical=False)
    about = models.CharField(max_length=2000, null=True, blank=True)

    objects = UserManager()
    premium = PremiumUserManager()

    class Meta:
        db_table = 'Users'
        indexes = [
            models.Index(fields=['username'])
        ]

    def save(self, *args, **kwargs):
        if not self.avatar:
            self.avatar = 'default-user.jpg'
        return super(User, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.username}"

    def is_mature(self):
        try:
            age = datetime.now().date() - self.date_of_birth
            if age >= 18:
                return True
            else:
                return False
        except TypeError:
            return False


class Follow(models.Model):

    user_from = models.ForeignKey(User, related_name='rel_from_set', on_delete=models.CASCADE)
    user_to = models.ForeignKey(User, related_name='rel_to_set', on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Follow'

    def __str__(self):
        return f"{self.user_from} follows {self.user_to}"
