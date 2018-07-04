from django.db.models.signals import post_init, post_save, pre_save
from django.dispatch import receiver

from .models import User

"""
@receiver(post_init, sender=User)
def backup_image_path(sender, instance, **kwargs):
    instance._tmp_avatar_file = instance.avatar


@receiver(post_save, sender=User)
def delete_previous_avatar(sender, instance, **kwargs):
    if hasattr(instance, '_tmp_avatar_file'):
        if instance._tmp_avatar_file != instance.avatar.path:
            instance._tmp_avatar_file.delete(save=False)
"""