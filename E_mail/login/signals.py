from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

@receiver(user_logged_out, sender='your_app.CustomUser')
def user_logged_out_handler(sender, request, user, **kwargs):
    print("User logged out signal received.")
    active_sessions = models.Session.objects.filter(
        expire_date__gt=timezone.now(),
        session_key__in=request.session.keys()
    )

    if not active_sessions.exists():
        user.is_active = False
        user.save()
        print("User is marked as inactive.")