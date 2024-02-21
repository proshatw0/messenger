import uuid
from django.db import models
from django.conf import settings
from django.db.models import Q

def user_icon_upload_to(instance, filename):
    extension = filename.split('.')[-1]
    new_filename = f"{uuid.uuid4()}.{extension}"
    return f'icons/{new_filename}'

class UserIcon(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, default=uuid.uuid4, unique=True)
    icon = models.ImageField(upload_to=user_icon_upload_to, default='icons/default_icon.png')

    @classmethod
    def get_icon_from_user(cls, user):
        return cls.objects.filter(user=user).first()

    @classmethod
    def get_or_create_default_icon(cls, user):
        user_icon, created = cls.objects.get_or_create(user=user)
        if created:
            user_icon.icon.name = user_icon_upload_to(user_icon, 'default_icon.png')
            user_icon.save()
        return user_icon

    def get_icon_url(self):
        if self.icon and self.icon.url:
            return self.icon.url
        else:
            return settings.STATIC_URL + 'default_icon.png'

    def change_icon(self, new_icon):
        self.icon = new_icon
        self.save()

    def save(self, *args, **kwargs):
        if not self.pk:
            existing_icon = UserIcon.objects.filter(user=self.user).first()

            if not existing_icon:
                super().save(*args, **kwargs)
                return

        super(UserIcon, self).save(*args, **kwargs)


def message_upload_to(instance, filename):
    instance.original_filename = filename
    extension = filename.split('.')[-1]
    return f"messages/{uuid.uuid4()}.{extension}"


class Message(models.Model):
    from_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sent_messages"
    )
    to_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="received_messages"
    )
    sent_at = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=255)
    text = models.TextField()
    is_read = models.BooleanField(default=False)
    is_starred_by_sender = models.BooleanField(default=False)
    is_starred_by_recipient = models.BooleanField(default=False)
    is_trashed_by_recipient = models.BooleanField(default=False)
    is_trashed_by_sender = models.BooleanField(default=False)
    is_deleted_by_recipient = models.BooleanField(default=False)
    is_deleted_by_sender = models.BooleanField(default=False)

    file = models.FileField(upload_to=message_upload_to, blank=True, null=True)
    original_filename = models.CharField(max_length=255, blank=True, null=True)

    @classmethod
    def create_message(cls, from_user, to_user, title, text, uploaded_file=None):
        message = cls(
            from_user=from_user,
            to_user=to_user,
            title=title,
            text=text,
        )

        if uploaded_file:
            message.file.save(uploaded_file.name, uploaded_file, save=False)

        message.save()
        return message
    

    def get_file_info(message):
        if message.files:
            original_filename, extension = message.files.name.split(f'.{message.files._get_extension_with_dot()}')[0:2]
            return [(original_filename, extension)]
        return []


    def get_all_messages_starred_by_user(self):
        return Message.objects.filter(
            Q(from_user=self) | Q(to_user=self),
            Q(is_starred_by_sender=True, from_user=self, is_deleted_by_sender=False) | Q(is_starred_by_recipient=True, to_user=self, is_trashed_by_sender=False),
        )
    
    
    def get_all_messages_trashed_by_user(self):
        return Message.objects.filter(
            Q(from_user=self) | Q(to_user=self),
            Q(is_trashed_by_sender=True, from_user=self, is_deleted_by_sender=False) | Q(is_trashed_by_recipient=True, to_user=self, is_trashed_by_sender=False),
        )
    

    def get_messages_sent_by_user(self):
        return Message.objects.filter(
            from_user=self,
            is_deleted_by_sender=False,
            is_trashed_by_sender=False,
        )
    

    def get_messages_received_by_user(self):
        return Message.objects.filter(
            to_user=self,
            is_deleted_by_recipient=False,
            is_trashed_by_recipient=False,
        )

    def get_messages_unreed_by_user(self):
        return Message.objects.filter(
            to_user=self,
            is_deleted_by_recipient=False,
            is_trashed_by_recipient=False,
            is_read=False,
        )  

    def trashed_by_recipient(self):
        self.is_read = True
        self.is_trashed_by_recipient = True
        self.save()

    def trashed_by_sender(self):
        self.is_trashed_by_sender = True
        self.save()    
    
    
    class Meta:
        ordering = ("-sent_at",)
