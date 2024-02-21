from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from django.conf.urls import handler404
from mymailbox import views
from django.conf import settings
from django.conf.urls.static import static

handler404 = views.custom_404

def my_view(request):
    next_url = request.GET.get('next', '/mailbox/{}'.format(request.user.email)) 
    return redirect(next_url)


urlpatterns = [
    path('', my_view),
    path('admin/', admin.site.urls),
    path('login/', include(('login.urls', 'login'), namespace='login')),
    path('mailbox/', include(('mymailbox.urls', 'mailbox'), namespace='mailbox')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)