from django.shortcuts import render
from django.contrib.auth import authenticate,login as auth_login
from django.views.decorators.csrf import csrf_exempt
from .forms import CommentForm,SpecificCommentForm
from django.contrib.auth.decorators import login_required
from django.utils import timezone
#from .forms import UserForm
from .models import User,Comment,SpecificComment, UserActiveUrl
from django.core import serializers
import datetime
from datetime import timedelta
import urllib.request
from django.core.exceptions import ObjectDoesNotExist
from tokenapi.decorators import token_required
from tokenapi.http import JsonResponse, JsonError
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
        #user_form = UserForm(request.POST)
        # check whether it's valid:
        user = authenticate(username=request.POST['user_name'], password=request.POST['user_pass'])
        if user is not None:
            auth_login(request, user)
            ses = json.dumps(request.session.session_key)
            return HttpResponse(ses, content_type="json")
        else:
            return HttpResponseBadRequest()


@csrf_exempt
def logout(request):
    if request.method == 'POST':
        try:
            user = User.objects.get(user_name = request.POST['user_name'])
            activeUrl = UserActiveUrl.objects.get(url = request.POST['url'], user = user)
            activeUrl.delete()
            return HttpResponse()
        except UserActiveUrl.DoesNotExist:
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
                user_form.save()
                return HttpResponse(json.dumps(""), content_type='json')



@csrf_exempt
@token_required
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
        user = User.objects.get(user_name = request.POST['user_name'])
        try:
            activeUrl = UserActiveUrl.objects.get(url = request.POST['url'], user = user)
            activeUrl.last_ping = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            activeUrl.save()
        except UserActiveUrl.DoesNotExist:
            user.useractiveurl_set.create(url = request.POST['url'], last_ping = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
            user.save()
        now=(datetime.datetime.now() - timedelta(seconds=60)).strftime("%Y-%m-%d %H:%M:%S")
        enddate = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        active_users = list(UserActiveUrl.objects.filter(last_ping__range=[now, enddate]).filter(url = request.POST['url']).values('user__user_name'))
        active_as_json = json.dumps(active_users)
        return HttpResponse(active_as_json, content_type='json')
