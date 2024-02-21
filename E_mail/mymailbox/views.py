import re
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.http import Http404

from login.models import CustomUser
from .models import Message
from .forms import NewMessageForm
from django.http import HttpResponse
from wsgiref.util import FileWrapper
import mimetypes
import os


from mymailbox.models import UserIcon, Message

def custom_404(request, exception):
    return render(request, '404.html', status=404)

@login_required
def mailbox_no(request):
    next_url = request.GET.get('next', '/mailbox/{}'.format(request.user.email)) 
    return redirect(next_url)

@login_required
def mailbox_sent(request, username):
    if request.user.email != username:
        next_url = request.GET.get('next', '/mailbox/{}'.format(request.user.email)) 
        return redirect(next_url)

    icon = UserIcon.get_icon_from_user(request.user)
    you_icon_url = icon.get_icon_url()

    message_list = []
    messages = Message.get_messages_sent_by_user(request.user)
    for message in messages:
        url = '/message/' + str(message.pk)
        message_obj = {
        "url": url,
        "read": True,
        "icon_url": UserIcon.get_icon_from_user(message.to_user).get_icon_url(),
        "email": message.to_user.email,
        "title": message.title,
        "value": message.text,
        "sent_at": message.sent_at,
        }
        message_list.append(message_obj)
    
    context = {
        "title": "Outgoing",
        "user_timezone": 'Asia/Novosibirsk',
        "you_email": request.user.email,
        "you_icon_url": you_icon_url,
        "Outgoing": True,
        "messages": message_list,
    }

    return render(request, 'mailbox.html', context)

@login_required
def mailbox_favorites(request, username):
    if request.user.email != username:
        next_url = request.GET.get('next', '/mailbox/{}'.format(request.user.email)) 
        return redirect(next_url)
    
    icon = UserIcon.get_icon_from_user(request.user)
    you_icon_url = icon.get_icon_url()

    message_list = []
    messages = Message.get_all_messages_starred_by_user(request.user)
    for message in messages:
        url = '/message/' + str(message.pk)
        message_obj = {
        "url": url,
        "read": message.is_read,
        "icon_url": UserIcon.get_icon_from_user(message.from_user).get_icon_url(),
        "email": message.from_user.email,
        "title": message.title,
        "value": message.text,
        "sent_at": message.sent_at,
        }
        message_list.append(message_obj)
    
    context = {
        "title": "Favorites",
        "user_timezone": 'Asia/Novosibirsk',
        "you_email": request.user.email,
        "you_icon_url": you_icon_url,
        "Favorites": True,
        "messages": message_list,
    }

    return render(request, 'mailbox.html', context)

@login_required
def mailbox_unread(request, username):
    if request.user.email != username:
        next_url = request.GET.get('next', '/mailbox/{}'.format(request.user.email)) 
        return redirect(next_url)
    
    icon = UserIcon.get_icon_from_user(request.user)
    you_icon_url = icon.get_icon_url()

    message_list = []
    messages = Message.get_messages_unreed_by_user(request.user)
    for message in messages:
        url = '/message/' + str(message.pk)
        message_obj = {
        "url": url,
        "read": False,
        "icon_url": UserIcon.get_icon_from_user(message.from_user).get_icon_url(),
        "email": message.from_user.email,
        "title": message.title,
        "value": message.text,
        "sent_at": message.sent_at,
        }
        message_list.append(message_obj)
    
    context = {
        "title": "Unread",
        "user_timezone": 'Asia/Novosibirsk',
        "you_email": request.user.email,
        "you_icon_url": you_icon_url,
        "Unread": True,
        "messages": message_list,
    }

    return render(request, 'mailbox.html', context)


@login_required
def mailbox_trash(request, username):
    if request.user.email != username:
        next_url = request.GET.get('next', '/mailbox/{}'.format(request.user.email)) 
        return redirect(next_url)
    
    icon = UserIcon.get_icon_from_user(request.user)
    you_icon_url = icon.get_icon_url()

    message_list = []
    messages = Message.get_all_messages_trashed_by_user(request.user)
    for message in messages:
        url = '/message/' + str(message.pk)
        message_obj = {
        "url": url,
        "read": False,
        "icon_url": UserIcon.get_icon_from_user(message.from_user).get_icon_url(),
        "email": message.from_user.email,
        "title": message.title,
        "value": message.text,
        "sent_at": message.sent_at,
        }
        message_list.append(message_obj)
    
    context = {
        "title": "Trashcan",
        "user_timezone": 'Asia/Novosibirsk',
        "you_email": request.user.email,
        "you_icon_url": you_icon_url,
        "Trashcan": True,
        "messages": message_list,
    }

    return render(request, 'mailbox.html', context)

@login_required
def mailbox_home(request, username):
    if request.user.email != username:
        next_url = request.GET.get('next', '/mailbox/{}'.format(request.user.email)) 
        return redirect(next_url)
    
    icon = UserIcon.get_icon_from_user(request.user)
    you_icon_url = icon.get_icon_url()

    message_list = []
    messages = Message.get_messages_received_by_user(request.user)
    for message in messages:
        url = '/message/' + str(message.pk)
        message_obj = {
        "url": url,
        "read": message.is_read,
        "icon_url": UserIcon.get_icon_from_user(message.from_user).get_icon_url(),
        "email": message.from_user.email,
        "title": message.title,
        "value": message.text,
        "sent_at": message.sent_at,
        }
        message_list.append(message_obj)
    
    context = {
        "title": "Incoming",
        "user_timezone": 'Asia/Novosibirsk',
        "you_email": request.user.email,
        "you_icon_url": you_icon_url,
        "Incoming": True,
        "messages": message_list,
    }

    return render(request, 'mailbox.html', context)

@login_required
def mailbox_message(request, username, messageid):
    if request.method == 'GET':
        if request.user.email != username:
            next_url = request.GET.get('next', '/mailbox/{}'.format(request.user.email)) 
            return redirect(next_url)
        message = get_object_or_404(Message, pk=messageid)
        if message.to_user == request.user or message.from_user == request.user:
            if not message.is_read:
                message.is_read = True
                message.save()
            if message.to_user == request.user:
                icon_url = UserIcon.get_icon_from_user(message.from_user).get_icon_url()
                email = message.from_user.email
                from_you = True
            else:
                icon_url = UserIcon.get_icon_from_user(message.to_user).get_icon_url()
                email = message.to_user.email
                from_you = False
            file_url = message.file.url if message.file else None
            if file_url:
                file_url = file_url.split("/")[-1]
            file_name = message.original_filename if message.original_filename else None
            message_obj = {
            "id": message.pk,
            "email": email,
            "title": message.title,
            "value": message.text,
            "sent_at": message.sent_at,
            "file_name": file_name,
            "file_url": file_url,
            "from_you": from_you,
            }
            return JsonResponse({'success': True, 'message': message_obj})
        else:
            raise Http404("Сообщение не найдено")
    


@login_required
def new_message(request):
    if request.method == 'POST':
        form = NewMessageForm(request.POST, request.FILES)
        if form.is_valid():
            recipient = form.cleaned_data['recipient']
            title = form.cleaned_data['title']
            text = form.cleaned_data['text']

            if 'file' in request.FILES:
                file = request.FILES['file']
                max_size = 15 * 1024 * 1024
                if file.size > max_size:
                    return JsonResponse({'error': 'File size exceeds 15 MB limit.'})
            else:
                file = None

            if not recipient or type(recipient) is not str or re.search(r'<script>.*</script>', recipient):
                return JsonResponse({'success': False, 'error': 'incorrect recipient'})
            user = CustomUser.objects.get_user_by_email(recipient)
            if user is None:
                return JsonResponse({'success': False, 'error': 'recipient was not found'})

            if not title or type(title) is not str or re.search(r'<script>.*</script>', title):
                return JsonResponse({'success': False, 'error': 'incorrect title'})

            if len(title) <= 10:
                return JsonResponse({'success': False, 'error': 'length of the title is at least 10 characters'})

            if not text or type(text) is not str or re.search(r'<script>.*</script>', text):
                return JsonResponse({'success': False, 'error': 'incorrect text'})

            if len(text) <= 10:
                return JsonResponse({'success': False, 'error': 'length of the text is at least 10 characters'})

            message = Message.create_message(request.user, user, title, text, uploaded_file=file)
            message_for_user = {
                "id": message.pk,
                "icon_url": UserIcon.get_icon_from_user(message.to_user).get_icon_url(),
                "email": message.to_user.email,
                "title": message.title,
                "text": message.text,
                "data": message.sent_at
            }
            return JsonResponse({'success': True, 'message': message_for_user})
        else:
            print(form.errors)
            return JsonResponse({'success': False, 'error': 'message is not valid'})
    else:
        return JsonResponse({'success': False, 'error': 'invalid request method'})
    

@login_required
def get_file(request, message_id):
    if request.method == 'GET':
        message = get_object_or_404(Message, id=message_id)
        if message.to_user == request.user or message.from_user == request.user:
            file_path = message.file.path if message.file else None

            if file_path and os.path.exists(file_path):
                with open(file_path, 'rb') as file:
                    response = HttpResponse(FileWrapper(file), content_type=mimetypes.guess_type(file_path)[0])
                    response['Content-Disposition'] = 'attachment'
                    return response
            else:
                return HttpResponse("File not found", status=404)
        else:
                return HttpResponse("File not found", status=404)


@login_required
def message_meneger(request):
    if request.method == 'POST':
        messages_id = 1
        print(messages_id)