from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from .forms import CommentForm,SpecificCommentForm
from django.utils import timezone
from .forms import UserForm
from .models import User,Comment,SpecificComment,ActiveUser
from django.core import serializers
import datetime
from datetime import timedelta
from django.core.exceptions import ObjectDoesNotExist
import json

# Create your views here.

from django.http import HttpResponse,HttpResponseBadRequest


def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")

@csrf_exempt
def login(request):
    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        user_form = UserForm(request.POST)
        # check whether it's valid:
        if user_form.is_valid():
            try:
                existeUser = User.objects.get(user_name= request.POST['user_name'])
                if existeUser.user_pass == request.POST['user_pass']:
                    #existeUser_as_json= serializers.serialize('json', [existeUser])
                    active=ActiveUser.objects.get(active_user=request.POST['user_name'])
                    active.is_active=True
                    active.last_ping=datetime.datetime.now()
                    active.save()
                    return HttpResponse()
                    #existeUserActivo = ActiveUser.objects.get(activeUser_user = request.POST['user_name'])
                    # if (existeUserActivo.activeUser_domain != request.POST['domain']):
                    #     usuarioActivo = ActiveUser(activeUser_user = request.POST['user_name'], activeUser_domain = request.POST['domain'])
                    #     usuarioActivo.save()
                    # return HttpResponse(existeUser_as_json, content_type='json')
                else:
                    return HttpResponseBadRequest()
            except User.DoesNotExist:
                return HttpResponseBadRequest()
                # except ActiveUser.DoesNotExist:
                #         usuarioActivo = ActiveUser(activeUser_user = request.POST['user_name'], activeUser_domain = request.POST['domain'])
                #         usuarioActivo.save()
                #         return HttpResponse(existeUser_as_json, content_type='json')


@csrf_exempt
def logout(request):
    if request.method == 'POST':
        active=ActiveUser.objects.get(active_user=request.POST['user_name'])
        active.is_active=False
        active.save()
        return HttpResponse()

@csrf_exempt
def registration(request):
    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        user_form = UserForm(request.POST)
        # check whether it's valid:
        if user_form.is_valid():
            try:
                existeUser = User.objects.get(user_name= request.POST['user_name'])
                return HttpResponseBadRequest()
            except User.DoesNotExist:
                newUser = user_form.save(commit = False)
                newUser.is_active=True
                newUser.last_ping=timezone.now()
                newUser.save()
                active=ActiveUser()
                active.active_user=request.POST['user_name']
                active.is_active=True
                active.last_ping=timezone.now()
                active.save()
                #newUser_as_json= serializers.serialize('json', [newUser])
                #return HttpResponse(newUser_as_json, content_type='json')
                return HttpResponse()



@csrf_exempt
def comments(request):
    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        comment_form = CommentForm(request.POST)
        # check whether it's valid:
        if comment_form.is_valid():
            # create the comment
            comment = comment_form.save(commit=False)
            comment.comment_date=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            comment.comment_user = User.objects.get(user_name = request.POST['user_name'])
            comment.save()
            return HttpResponse()
        else:
            return HttpResponseBadRequest()

    # if a GET (or any other method) we'll create a blank form
    else:
        comments=list(Comment.objects.filter(specificcomment__isnull = True, comment_url=request.GET['comment_url']).values('comment_user__user_name', 'comment_text' , 'comment_date'))
        comments_as_json = json.dumps(comments)
        return HttpResponse(comments_as_json, content_type='json')


            # @csrf_exempt
            # def usuariosActivos(request):
            #     usuarios=ActiveUser.objects.filter(activeUser_domain=request.GET['dominio'])
            #     if (len(usuarios)!=0):
            #         usuarios_as_json = serializers.serialize('json', usuarios)
            #         return HttpResponse(usuarios_as_json, content_type='json')
            #     else:
            #         return HttpResponse()


@csrf_exempt
def specific_comments(request):
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        comment_form = SpecificCommentForm(request.POST)
        # check whether it's valid:
        if comment_form.is_valid():
            # create the comment
            comment = comment_form.save(commit=False)
            comment.comment_date=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            comment.comment_user = User.objects.get(user_name = request.POST['user_name'])
            comment.save()
            return HttpResponse()
        else:
            return HttpResponseBadRequest()

    # if a GET (or any other method) we'll create a blank form
    else:
        comments=list(SpecificComment.objects.filter(comment_url=request.GET['comment_url'],url_tag=request.GET['url_tag']).values('comment_user__user_name', 'comment_text' , 'comment_date'))
        comments_as_json = json.dumps(comments)
        return HttpResponse(comments_as_json, content_type='json')

@csrf_exempt
def user_ping(request):
    if request.method == 'POST':
        active=ActiveUser.objects.get(active_user=request.POST['user_name'])
        active.is_active=True
        active.last_ping=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        active.save()
        now=(datetime.datetime.now() - timedelta(seconds=60)).strftime("%Y-%m-%d %H:%M:%S")
        enddate = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(now)
        print(enddate)
        active_users=list(ActiveUser.objects.filter(last_ping__range=[now, enddate]).values('active_user'))
        print(active_users)
        active_as_json = json.dumps(active_users)
        return HttpResponse(active_as_json, content_type='json')
