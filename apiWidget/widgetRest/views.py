import datetime
import json
import os
from datetime import timedelta

from django.contrib import messages
from django.contrib.auth import authenticate, login as auth_login, logout as log_out
from django.contrib.auth.decorators import login_required
from django.core import serializers
from django.core.files.base import ContentFile
from django.db import IntegrityError
from django.db.models import Q
from django.shortcuts import redirect
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.generic.list import ListView
from tokenapi.decorators import token_required

from .forms import LoginForm,UserCreationForm,WidgetForm
from .models import User, Widget, Element, SpecificComment, UserActiveUrl, Poll, PollQuestion, Vote, PollQuestionOption, Chat

# Create your views here.

from django.http import HttpResponse, HttpResponseBadRequest




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
@token_required
def logout(request):
    if request.method == 'POST':
        try:
            user_id = get_user_pk(request.META.get('HTTP_AUTHORIZATION'))
            user = User.objects.get(pk=user_id)
            UserActiveUrl.objects.filter(url=request.POST['url'], user=user).delete()
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
            newUser = user_form.save()
            for i in range(1,5):
                defaultWidget = Widget.objects.get(pk=i)
                newUser.widget_set.add(defaultWidget)
            return HttpResponse()
        else:
            print(user_form.errors)
            return HttpResponseBadRequest()


@csrf_exempt
@token_required
def objects(request):
    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        # check whether it's valid:
        user_id = get_user_pk(request.META.get('HTTP_AUTHORIZATION'))
        user = User.objects.get(pk=user_id)
        ele = Element()
        ele.username = user.username
        ele.url = request.POST['url']
        ele.date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        ele.widget = Widget.objects.get(pk=request.POST['idWidget'])
        ele.element =json.loads(request.POST['data'])
        ele.save()
        return HttpResponse(ele.id)

    # if a GET (or any other method) we'll create a blank form
    else:
        kwargs = {}
        if 'url' in request.GET:
            kwargs['url'] = request.GET['url']
        kwargs['widget'] = request.GET['idWidget']

        try:
            params = request.GET['params']
        except KeyError: # Be explicit with catching exceptions.
            params = {}
        if params:
            kwargsjson = {}
            par = json.loads(params)
            for key,value in par.iteritems():
                kwargsjson[ key ] = value
            kwargs['element__contains'] = kwargsjson
        objects = list(Element.objects.filter(**kwargs).values('id','username','date','element'))
        objects_as_json = json.dumps(objects)
        return HttpResponse(objects_as_json, content_type='json')

@csrf_exempt
@token_required
def updateObject(request):
    if request.method == 'POST':
        kwargs = {}
        #kwargs['url'] = request.POST['url']    OJO!! YA NO TIENE EN CUENTA URL, DEBATIR SOBRE ESTO!!
        kwargs['widget'] = request.POST['idWidget']
        try:
            params = request.POST['params']
        except KeyError:
            params = {}
        if params:
            kwargsjson = {}
            par = json.loads(params)
            for key,value in par.iteritems():
                kwargsjson[ key ] = value
            kwargs['element__contains'] = kwargsjson
        objeto = Element.objects.get(**kwargs)
        objeto.date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        objeto.element = json.loads(request.POST['object'])
        objeto.save()
        return HttpResponse()


@csrf_exempt
@token_required
def scripts(request):
    if request.method == 'GET':
        widgets = list(Widget.objects.all().values('widget_title'))
        wAsJson = json.dumps(widgets)
        return HttpResponse(wAsJson, content_type='json')



@csrf_exempt
@token_required
def widget(request):
    if request.method == 'POST':
        try:
            widget = Widget(widget_name=request.POST['name'], widget_icon=request.POST['icon'])
            widget.save()
            return HttpResponse(widget.id)
        except IntegrityError:
            return HttpResponseBadRequest()
    else:
        widgets = list(Widget.objects.all().values('pk','widget_name','widget_icon','widget_title', 'description','file'))
        wAsJson = json.dumps(widgets)
        return HttpResponse(wAsJson, content_type='json')

@csrf_exempt
@token_required
def getWidget(request):
    if request.method == 'GET':
        try:
            widget = Widget.objects.get(pk=request.GET['idWidget'])
            data = widget.file.read()
            widget.file = data
            widgetAsJson = serializers.serialize('json', [widget], fields=('pk', 'widget_icon', 'widget_name', 'description', 'widget_title','file'))
            return HttpResponse(widgetAsJson, content_type='json')
        except Widget.DoesNotExist:
            return HttpResponseBadRequest()

@csrf_exempt
@token_required
def user_ping(request):
    if request.method == 'POST':
        user_id = get_user_pk(request.META.get('HTTP_AUTHORIZATION'))
        user = User.objects.get(pk=user_id)
        try:
            activeUrl = UserActiveUrl.objects.get(url=request.POST['url'], widget=request.POST['id'],user=user)
            activeUrl.last_ping = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            activeUrl.save()
        except UserActiveUrl.DoesNotExist:
            widget = Widget.objects.get(pk = request.POST['id'])
            user.useractiveurl_set.create(url=request.POST['url'],
                                          last_ping=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),widget=widget)
            user.save()
        return HttpResponse()
    else:
        now = (datetime.datetime.now() - timedelta(seconds=15)).strftime("%Y-%m-%d %H:%M:%S")
        enddate = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        try:
            widget = request.GET['idWidget']
            active_users = list(
            UserActiveUrl.objects.filter(last_ping__range=[now, enddate], widget=widget,url=request.GET['url']).values(
                'user__username'))
        except KeyError: # Be explicit with catching exceptions.
            active_users = list(
            UserActiveUrl.objects.filter(last_ping__range=[now, enddate], url=request.GET['url']).values(
                'user__username'))
        active_as_json = json.dumps(active_users)
        return HttpResponse(active_as_json, content_type='json')

@csrf_exempt
@token_required
def addUserWidget(request):
    if request.method == 'POST':
        user_id = get_user_pk(request.META.get('HTTP_AUTHORIZATION'))
        user = User.objects.get(pk=user_id)
        widget = Widget.objects.get(pk=request.POST['idWidget'])
        user.widgets.add(widget)
        return HttpResponse()

@csrf_exempt
def framework(request):
    if request.method == 'GET':
        with open('/Users/ferminrecalt/Documents/TesisGit/apiWidget/files/socialEye.js', 'r') as f:
            ar=f.read();
        return HttpResponse(ar)

@csrf_exempt
def interface(request):
    if request.method == 'GET':
        with open('/Users/ferminrecalt/Documents/TesisGit/apiWidget/files/widgetInterface.js', 'r') as f:
            ar=f.read();
        return HttpResponse(ar)


@csrf_exempt
@token_required
def removeUserWidget(request):
    if request.method == 'POST':
        user_id = get_user_pk(request.META.get('HTTP_AUTHORIZATION'))
        user = User.objects.get(pk=user_id)
        widget = Widget.objects.get(pk=request.POST['idWidget'])
        user.widgets.remove(widget)
        return HttpResponse()

@csrf_exempt
@token_required
def widgetsByUser(request):
    if request.method == 'GET':
        user_id = get_user_pk(request.META.get('HTTP_AUTHORIZATION'))
        user = User.objects.get(pk=user_id)
        widgets = list(user.widgets.all())
        for w in widgets:
            data=w.file.read()
            w.file = data
        widgets_as_json = serializers.serialize('json', widgets, fields=('pk', 'widget_icon', 'widget_name', 'description', 'widget_title','file'))
        return HttpResponse(widgets_as_json, content_type='json')


def index(request):
    return render(request, 'index.html')

def register(request):
    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        form = UserCreationForm(request.POST)
        # check whether it's valid:
        if form.is_valid():
            form.save()
            # process the data in form.cleaned_data as required
            # ...
            # redirect to a new URL:
            return redirect('index')

    # if a GET (or any other method) we'll create a blank form
    else:
        form = UserCreationForm()

    return render(request, 'register.html', {'userCreationForm': form })




def loginWeb(request):
    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        form = LoginForm(request.POST)
        # check whether it's valid:
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(username=username, password=password)
            if user is not None:
                auth_login(request, user)
                return redirect('index')

    # if a GET (or any other method) we'll create a blank form
    else:
        form = LoginForm()
    return render(request, 'login.html', {'loginForm': form })


@login_required
def newWidget(request):
    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        form = WidgetForm(request.POST,request.FILES)
        # check whether it's valid:
        if form.is_valid():
            # filename = form.cleaned_data['title']
            # filename = filename +'.js'
            # # save the uploaded file inside that folder.
            # full_filename = os.path.join('/Users/ferminrecalt/Desktop/', 'Files', filename)
            # fout = open(full_filename, 'wb+')
            # # Iterate through the chunks.
            # file_content = ContentFile(form.cleaned_data['file'].read())
            # for chunk in file_content.chunks():
            #     fout.write(chunk)
            # fout.close()
            w = Widget();
            w.file =form.cleaned_data['file']
            w.widget_name=form.cleaned_data['title']
            w.widget_title=form.cleaned_data['title']
            w.description=form.cleaned_data['descripcion']
            w.widget_icon=form.cleaned_data['icon']
            user = User.objects.only('id').get(id=request.user.id)
            w.owner=user
            w.save()
            messages.success(request, 'El widget se ha guardado correctamente',fail_silently=True)
            return redirect('widget-list')

    # if a GET (or any other method) we'll create a blank form
    else:
        form = WidgetForm()
    return render(request, 'newWidget.html', {'uploadForm': form })

@login_required
def remove(request):
    if request.method == 'GET':
        id = request.GET['id']
        Widget.objects.filter(id=id).delete()
        messages.success(request, 'El widget se ha eliminado correctamente',fail_silently=True)
        return redirect('widget-list')


class WidgetListView(ListView):

    model = Widget
    template_name = 'widget_list.html'

    def get_queryset(self):
        qs = super(WidgetListView, self).get_queryset()
        return qs.filter(owner=self.request.user.id)
    # def get_context_data(self, **kwargs):
    #     qs = super(WidgetListView, self).get_queryset()
    #     return qs.filter(owner=self.request.user.id)

@csrf_exempt
@token_required
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





def get_user_pk(basic_auth):
    auth_method, auth_string = basic_auth.split(' ', 1)
    if auth_method.lower() == 'basic':
        auth_string = auth_string.strip().decode('base64')
        user_id, token = auth_string.split(':', 1)
    return user_id


@csrf_exempt
@token_required
def poll_list(request):
    if request.method == 'POST':
        poll_list = (list(Poll.objects.filter(url=request.POST['url']).values('date','description','pk','poll_user__username')))
        poll_list_as_json = json.dumps(poll_list)
        return HttpResponse(poll_list_as_json, content_type='json')

@csrf_exempt
@token_required
def poll_details(request):
    idEncuesta = request.GET['idEncuesta']
    poll = Poll.objects.filter(pk=idEncuesta)
    data = map(lambda x: x.what_i_need_in_ajax_call_for_poll(), poll)
    return HttpResponse(json.dumps(list(data)), content_type='application/json')

@csrf_exempt
@token_required
def poll_add(request):
    if request.method == 'POST':
        opciones = json.loads(request.POST['opciones'])
        preguntas = json.loads(request.POST['preguntas'])
        poll = Poll()
        poll.date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        poll.description = request.POST['descripcion']
        user_id = get_user_pk(request.META.get('HTTP_AUTHORIZATION'))
        poll.poll_user = User.objects.get(pk=user_id)
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
                opcion.poll_question = pregunta
                opcion.save()

        return HttpResponse()


@csrf_exempt
@token_required
def poll_vote(request):
    if request.method == 'POST':
        votes = json.loads(request.POST['votos'])
        for key in votes:
            vote = Vote()
            vote.poll_question = PollQuestion.objects.get(pk=key)
            vote.question_option = PollQuestionOption.objects.get(pk=votes[key])
            vote.save()

        #Ahora voy a recuperar la encuesta de nuevo para armar los resultados para mostrarlos con la barra
        # poll = Poll.objects.get(pk=request.POST['idEncuestaActual'])
        # preguntas = poll.pollquestion_set.all()
        # porcentajes = {}
        # for p in preguntas:
        #     opciones = p.pollquestionoption_set.all()
        #     total = 0
        #     for o in opciones:
        #         total += o.votes
        #
        #     for o in opciones:
        #         num = (o.votes * 100) / float(total)
        #         decimales = num - int(num)
        #         if decimales >= 0.5:
        #             porcentajes[o.pk] = int(num) + 1
        #         else:
        #             porcentajes[o.pk] = int(num)
        #
        # return HttpResponse(json.dumps(porcentajes), content_type='application/json')
        return HttpResponse()


@csrf_exempt
@token_required
def get_votes(request):
    if request.method == 'POST':
        id_question = request.POST['id_question']
        votes = list(Vote.objects.filter(poll_question__pk = id_question).values('question_option__pk'))
        return HttpResponse(json.dumps(votes),content_type='json')

@csrf_exempt
@token_required
def chats(request):
    if request.method == 'GET':
        user_id = get_user_pk(request.META.get('HTTP_AUTHORIZATION'))
        chats = list((Chat.objects.filter(Q(user1=user_id) | Q(user2=user_id))).values('user1__pk', 'user2__pk',
                                                                                       'user1__username',
                                                                                       'user2__username'))
        chats_as_json = json.dumps(chats)
        return HttpResponse(chats_as_json, content_type='json')


@csrf_exempt
@token_required
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
@token_required
def saveMessage(request):
    if request.method == 'POST':
        user_id = get_user_pk(request.META.get('HTTP_AUTHORIZATION'))
        usuarioActual = User.objects.get(pk=user_id)
        otroUsuario = request.POST['usuario2']
        chat = Chat.objects.get(Q(user1=user_id, user2=otroUsuario) | Q(user1=otroUsuario, user2=user_id))
        chat.chatmessage_set.create(text=request.POST['message'], userName=usuarioActual.username)
        return HttpResponse()

