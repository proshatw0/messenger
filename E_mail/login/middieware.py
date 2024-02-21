from django.shortcuts import redirect
from django.urls import reverse

class MyMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if not hasattr(request, 'user') or not request.user.is_authenticated:
            if not getattr(request, '_redirected', False) and not request.path.startswith('/static/'):
                request._redirected = True 
                if not request.path.startswith(reverse('login:login')):
                    return redirect('login:login')

        response = self.get_response(request)
        return response