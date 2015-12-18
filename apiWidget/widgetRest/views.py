from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from .forms import CommentForm
from .forms import UserForm
from .models import User,Comment,ActiveUser
from django.core import serializers
import datetime
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
                    existeUser_as_json= serializers.serialize('json', [existeUser])
                    existeUserActivo = ActiveUser.objects.get(activeUser_user = request.POST['user_name'])
                    if (existeUserActivo.activeUser_domain != request.POST['domain']):
                        usuarioActivo = ActiveUser(activeUser_user = request.POST['user_name'], activeUser_domain = request.POST['domain'])
                        usuarioActivo.save()
                    return HttpResponse(existeUser_as_json, content_type='json')
                else:
                    return HttpResponseBadRequest()
            except User.DoesNotExist:
                return HttpResponseBadRequest()
            except ActiveUser.DoesNotExist:
                    usuarioActivo = ActiveUser(activeUser_user = request.POST['user_name'], activeUser_domain = request.POST['domain'])
                    usuarioActivo.save()
                    return HttpResponse(existeUser_as_json, content_type='json')


@csrf_exempt
def logout(request):
    if request.method == 'POST':
        usuarioActivo = ActiveUser.objects.get(activeUser_user = request.POST['user_name'])
        usuarioActivo.delete()
        return HttpResponse(json.dumps({}), content_type='json')

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
                newUser.save()
                newUser_as_json= serializers.serialize('json', [newUser])
                return HttpResponse(newUser_as_json, content_type='json')



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
            print(datetime.datetime.now())
            comment.comment_date=datetime.datetime.now()
            comment.comment_user = User.objects.get(user_name = request.POST['user_name'])
            comment.save()
            return HttpResponse()
        else:
            return HttpResponseBadRequest()

    # if a GET (or any other method) we'll create a blank form
    else:
        comments=list(Comment.objects.filter(comment_url=request.GET['comment_url']).values('comment_user__user_name', 'comment_text' , 'comment_date'))
        if (len(comments)!=0):
            comments_as_json = json.dumps(comments)
            return HttpResponse(comments_as_json, content_type='json')
        else:
            return HttpResponse()

@csrf_exempt
def usuariosActivos(request):
    usuarios=ActiveUser.objects.filter(activeUser_domain=request.GET['dominio'])
    if (len(usuarios)!=0):
        usuarios_as_json = serializers.serialize('json', usuarios)
        return HttpResponse(usuarios_as_json, content_type='json')
    else:
        return HttpResponse()