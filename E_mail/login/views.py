from datetime import datetime
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from .models import CustomUser, EmailOccupiedError
from django.contrib.auth import authenticate, login
from django.core.exceptions import ValidationError
import re
from django.contrib.auth.models import AnonymousUser

def login_view(request):
    if request.user is None or not request.user.is_authenticated or isinstance(request.user, AnonymousUser):
        if not isinstance(request.user, AnonymousUser):
            next_url = request.GET.get('next', '/mailbox/{}'.format(request.user.email))
            return redirect(next_url)

    if request.method == 'POST':
        mod = request.POST.get('mode')

        if mod == "login":
            email = request.POST.get('email')
            password = request.POST.get('password')
        elif mod == "register":
            email = request.POST.get('email_registration')
            password = request.POST.get('password_registration')

        if not email or type(email) is not str or re.search(r'<script>.*</script>', email):
            return JsonResponse({'success': False, 'error': 'incorrect email'})
        
        if '@itworks.ru' not in email:
            return JsonResponse({'success': False, 'error': 'email must contain "@itworks.ru"'})
        

        if not password or type(password) is not str or re.search(r'<script>.*</script>', password):
            return JsonResponse({'success': False, 'error': 'incorrect password'})


        if mod == "login":
            user = authenticate(username=email, password=password)

            if user is not None:
                login(request, user)
                user.is_active = True
                CustomUser.objects.filter(pk=user.pk).update(last_login=datetime.now())
                user.save()
                next_url = request.GET.get('next', '/mailbox/{}'.format(request.user.email))
            
                return JsonResponse({'success': True, 'next_url': next_url})
            else:
                return JsonResponse({'success': False, 'error': 'incorrect email or password'})
        elif mod == "register":
            try:
                CustomUser.objects.create_user(email=email, password=password)
                user = authenticate(username=email, password=password)
                login(request, user)
                next_url = request.GET.get('next', '/mailbox/{}'.format(email))
                return JsonResponse({'success': True, 'next_url': next_url})
            
            except EmailOccupiedError:
                return JsonResponse({'success': False, 'error': 'this email is already registered'})

    return render(request, 'login.html')