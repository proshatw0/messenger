from django.urls import path
from . import views

urlpatterns = [
    path('', views.mailbox_no, name='mailbox_no'),
    path('new/', views.new_message, name='new_message'),
    path('file/<str:message_id>/', views.get_file, name='file'),
    path('<str:username>/', views.mailbox_home, name='mailbox'),
    path('<str:username>/sent', views.mailbox_sent, name='mailbox_sent'),
    path('<str:username>/favorites', views.mailbox_favorites, name='mailbox_favorites'),
    path('<str:username>/unread', views.mailbox_unread, name='mailbox_unread'),
    path('<str:username>/trash', views.mailbox_trash, name='mailbox_trash'),
    path('<str:username>/message/<int:messageid>', views.mailbox_message, name='mailbox_message'),
]
