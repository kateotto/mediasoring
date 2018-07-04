from django.db import models
from django.utils.text import slugify
from taggit.managers import TaggableManager

from mediasoring.validators import FileValidator


def image_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/<username>/image/<filename>
    return '{0}/image/{1}'.format(instance.author.username, filename)


def video_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/<username>/video/<filename>
    return '{0}/video/{1}'.format(instance.author.username, filename)


def media_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/<username>/video/<filename>
    return '{0}/media/{1}'.format(instance.author.username, filename)

_CATEGORIES = (
    ('Sport', 'Sport'),
    ('Fashion', 'Fashion'),
    ('Music', 'Music'),
    ('IT', 'IT'),
    ('Lifestyle', 'Lifestyle'),
    ('Travel', 'Travel'),
)


class Post(models.Model):

    author = models.ForeignKey('users.User', on_delete=models.CASCADE)
    title = models.CharField(max_length=60)
    slug = models.SlugField(max_length=80, null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    media = models.FileField(upload_to=media_directory_path,
                             validators=[
                                 FileValidator(allowed_extensions=('jpg', 'JPEG', 'mp4', 'fly', 'png'),
                                               max_size=10*1024*1024)
                             ],
                             null=True,
                             blank=True)
    description = models.CharField(max_length=1000, null=True, blank=True)
    category = models.CharField(max_length=12, choices=_CATEGORIES)
    tags = TaggableManager()
    likes = models.ManyToManyField('users.User', through='Like', related_name='likes', symmetrical=False)

    class Meta:
        db_table = 'Post'

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):

        if not self.slug:
            self.slug = slugify(self.title)
        return super(Post, self).save()

    def __str__(self):
        return f"Post {self.title} by {self.author.username} {self.created}"


class Like(models.Model):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)

    class Meta:
        db_table = 'Like'

    def __str__(self):
        return f"{self.user.username} likes post {self.post.id}"
