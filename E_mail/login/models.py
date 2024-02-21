from django.db import IntegrityError, models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

from mymailbox.models import UserIcon

class EmailOccupiedError(ValueError):
    pass

class CustomUserManager(BaseUserManager):
    def get_user_by_email(self, email):
        try:
            return self.get(email=email)
        except self.model.DoesNotExist:
            return None

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)

        try:
            user.save(using=self._db)
            user_icon, created = UserIcon.objects.get_or_create(user=user)
            user_icon.save()
        except IntegrityError:
            raise EmailOccupiedError('This email is occupied')

        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)
    
    def user_exists(self, email, password):
        user = self.get(email=email)
        if user.check_password(password):
            return user
        return None

class CustomUser(AbstractBaseUser, PermissionsMixin):
    id = models.BigAutoField(primary_key=True)
    email = models.CharField(unique=True, max_length=100)
    password = models.CharField(max_length=128)
    is_active = models.BooleanField(default=True)
    last_login = models.DateTimeField(auto_now_add=True) 
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

@receiver(post_save, sender=CustomUser)
def create_user_icon(sender, instance, created, **kwargs):
    if created:
        UserIcon.objects.create(user=instance)