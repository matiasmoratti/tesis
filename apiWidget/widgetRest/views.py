from django.shortcuts import render
from django.contrib.auth import authenticate, login as auth_login, logout as log_out
from django.views.decorators.csrf import csrf_exempt
from .forms import CommentForm, SpecificCommentForm
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from .forms import UserForm
from .models import User, Comment, SpecificComment, UserActiveUrl, Poll, PollQuestion, PollQuestionOption, Chat, \
    ChatMessage
from django.core import serializers
import datetime
from datetime import timedelta
from django.core.exceptions import ObjectDoesNotExist
from tokenapi.decorators import token_required
from tokenapi.http import JsonResponse, JsonError
from django.db.models import Q
import json

# Create your views here.

from django.http import HttpResponse, HttpResponseBadRequest


def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")


# @csrf_exempt
# def login(request):
#     # if this is a POST request we need to process the form data
#     if request.method == 'POST':
#         # create a form instance and populate it with data from the request:
#         #user_form = UserForm(request.POST)
#         # check whether it's valid:
#         user = authenticate(username=request.POST['user_name'], password=request.POST['user_pass'])
#         if user is not None:
#             auth_login(request, user)
#             ses = json.dumps(request.session.session_key)
#             return HttpResponse(ses, content_type="json")
#         else:
#             return HttpResponseBadRequest()


@csrf_exempt
# @token_required
def logout(request):
    if request.method == 'POST':
        try:
            user_id = get_user_pk(request.META.get('HTTP_AUTHORIZATION'))
            user = User.objects.get(pk=user_id)
            activeUrl = UserActiveUrl.objects.get(url=request.POST['url'], user=user)
            activeUrl.delete()
            log_out(request)
            return HttpResponse()
        except UserActiveUrl.DoesNotExist:
            log_out(request)
            return HttpResponse()


@csrf_exempt
def registration(request):
    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        user_form = UserCreationForm(request.POST)
        # check whether it's valid:
        if user_form.is_valid():
            user_form.save()
            return HttpResponse()
        else:
            print(user_form.errors)
            return HttpResponseBadRequest()


@csrf_exempt
# @token_required
def comments(request):
    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        comment_form = CommentForm(request.POST)
        # check whether it's valid:
        if comment_form.is_valid():
            # create the comment
            comment = comment_form.save(commit=False)
            comment.comment_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            user_id = get_user_pk(request.META.get('HTTP_AUTHORIZATION'))
            comment.comment_user = User.objects.get(pk=user_id)
            comment.save()
            return HttpResponse(comment.comment_user.username)
        else:
            return HttpResponseBadRequest()

    # if a GET (or any other method) we'll create a blank form
    else:
        comments = list(
            Comment.objects.filter(specificcomment__isnull=True, comment_url=request.GET['comment_url']).values(
                'comment_user__username', 'comment_text', 'comment_date'))
        comments_as_json = json.dumps(comments)
        return HttpResponse(comments_as_json, content_type='json')


@csrf_exempt
# @token_required
def specific_comments(request):
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        comment_form = SpecificCommentForm(request.POST)
        # check whether it's valid:
        if comment_form.is_valid():
            # create the comment
            comment = comment_form.save(commit=False)
            comment.comment_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            user_id = get_user_pk(request.META.get('HTTP_AUTHORIZATION'))
            comment.comment_user = User.objects.get(pk=user_id)
            comment.save()
            return HttpResponse(comment.comment_user.username)
        else:
            return HttpResponseBadRequest()

    # if a GET (or any other method) we'll create a blank form
    else:
        comments = list(SpecificComment.objects.filter(comment_url=request.GET['comment_url'],
                                                       url_tag=request.GET['url_tag']).values('comment_user__username',
                                                                                              'comment_text',
                                                                                              'comment_date'))
        comments_as_json = json.dumps(comments)
        return HttpResponse(comments_as_json, content_type='json')


@csrf_exempt
# @token_required
def user_ping(request):
    if request.method == 'POST':
        user_id = get_user_pk(request.META.get('HTTP_AUTHORIZATION'))
        user = User.objects.get(pk=user_id)
        try:
            activeUrl = UserActiveUrl.objects.get(url=request.POST['url'], user=user)
            activeUrl.last_ping = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            activeUrl.save()
        except UserActiveUrl.DoesNotExist:
            user.useractiveurl_set.create(url=request.POST['url'],
                                          last_ping=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
            user.save()
        now = (datetime.datetime.now() - timedelta(seconds=60)).strftime("%Y-%m-%d %H:%M:%S")
        enddate = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        active_users = list(
            UserActiveUrl.objects.filter(last_ping__range=[now, enddate]).filter(url=request.POST['url']).values(
                'user__username', 'user__pk'))
        active_as_json = json.dumps(active_users)
        return HttpResponse(active_as_json, content_type='json')


def get_user_pk(basic_auth):
    auth_method, auth_string = basic_auth.split(' ', 1)
    if auth_method.lower() == 'basic':
        auth_string = auth_string.strip().decode('base64')
        user_id, token = auth_string.split(':', 1)
    return user_id


@csrf_exempt
# @token_required
def poll_list(request):
    if request.method == 'POST':
        poll_list = (list(Poll.objects.filter(url=request.POST['url']).values('date','description','pk','poll_user__username')))
        poll_list_as_json = json.dumps(poll_list)
        return HttpResponse(poll_list_as_json, content_type='json')


@csrf_exempt
# @token_required
def poll_add(request):
    if request.method == 'POST':
        opciones = json.loads(request.POST['opciones'])
        preguntas = json.loads(request.POST['preguntas'])
        poll = Poll()
        poll.date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        poll.description = request.POST['descripcion']
        poll.poll_user = User.objects.get(username='fermin')
        # poll.poll_user = User.objects.get(pk=get_user_pk(request.META.get('HTTP_AUTHORIZATION')))
        poll.url = request.POST['url']
        poll.save()
        numPregunta = 1
        pregunta = PollQuestion()
        pregunta.question = preguntas[str(numPregunta)]
        pregunta.poll=poll
        pregunta.save()
        for o in opciones:
            for key, value in o.iteritems():
                if str(numPregunta) != key:
                    numPregunta += 1
                    pregunta = PollQuestion()
                    pregunta.question = preguntas[str(numPregunta)]
                    pregunta.poll=poll
                    pregunta.save()
                opcion = PollQuestionOption()
                opcion.option = value
                opcion.votes = 0
                opcion.poll_question = pregunta
                opcion.save()

        return HttpResponse()


@csrf_exempt
# @token_required
def poll_vote(request):
    if request.method == 'POST':
        votes = json.loads(request.POST['json_data'])
        for v in votes:
            poll_question_option = PollQuestionOption.objects.get(pk=v['id'])
            poll_question_option.votes += 1
            poll_question_option.save()

        return HttpResponse()


@csrf_exempt
# @token_required
def chats(request):
    if request.method == 'GET':
        user_id = get_user_pk(request.META.get('HTTP_AUTHORIZATION'))
        chats = list((Chat.objects.filter(Q(user1=user_id) | Q(user2=user_id))).values('user1__pk', 'user2__pk',
                                                                                       'user1__username',
                                                                                       'user2__username'))
        chats_as_json = json.dumps(chats)
        return HttpResponse(chats_as_json, content_type='json')


@csrf_exempt
# @token_required
def getChat(request):
    if request.method == 'POST':
        user_id = get_user_pk(request.META.get('HTTP_AUTHORIZATION'))
        otroUsuario = request.POST['usuario2']
        try:
            chat = Chat.objects.get(Q(user1=user_id, user2=otroUsuario) | Q(user1=otroUsuario, user2=user_id))
            messages = list(chat.chatmessage_set.all())
            messages_as_json = serializers.serialize('json', messages, fields=('text', 'userName'))
            return HttpResponse(messages_as_json, content_type='json')
        except Chat.DoesNotExist:
            chat = Chat()
            chat.user1 = User.objects.get(pk=user_id)
            chat.user2 = User.objects.get(pk=otroUsuario)
            chat.save()
            return HttpResponse({}, content_type='json')


@csrf_exempt
# @token_required
def saveMessage(request):
    if request.method == 'POST':
        user_id = get_user_pk(request.META.get('HTTP_AUTHORIZATION'))
        usuarioActual = User.objects.get(pk=user_id)
        otroUsuario = request.POST['usuario2']
        chat = Chat.objects.get(Q(user1=user_id, user2=otroUsuario) | Q(user1=otroUsuario, user2=user_id))
        chat.chatmessage_set.create(text=request.POST['message'], userName=usuarioActual.username)
        return HttpResponse()
