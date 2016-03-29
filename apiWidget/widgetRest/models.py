from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import JSONField

# Create your models here.



class Widget(models.Model):
    widget_name = models.CharField(max_length=200, unique=True)
    # widget_icon = models.CharField(max_length=200, unique=True)

class Element(models.Model):
    widget = models.ForeignKey(Widget, on_delete=models.CASCADE)
    url = models.CharField(max_length=200)
    username = models.CharField(max_length=200)
    date = models.CharField(max_length=200)
    element = JSONField(default = {})

class Comment(models.Model):
    comment_text = models.CharField(max_length=200)
    comment_url = models.CharField(max_length=200)
    comment_date = models.CharField(max_length=200)
    comment_user = models.ForeignKey(User, on_delete=models.CASCADE)


class SpecificComment(Comment):
    url_tag = models.CharField(max_length=200)


class UserActiveUrl(models.Model):
    url = models.CharField(max_length=500)
    last_ping = models.DateTimeField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class Poll(models.Model):
    poll_user = models.ForeignKey(User, on_delete=models.CASCADE)
    url = models.CharField(max_length=200)
    date = models.CharField(max_length=200)
    description = models.CharField(max_length=200)
    def what_i_need_in_ajax_call_for_poll(self): #METODO QUE ES UTILIZADO EN VIEWS.PY PARA DEVOLVER LO QUE YO QUIERA DEL OBJETO EN UN LLAMADO AJAX
        return {
            "date": self.date,
            "description": self.description,
            "pk": self.id,
            "questions": list(map(lambda x: x.what_i_need_in_ajax_call_for_pollquestion_from_poll(),  self.pollquestion_set.all()))
        }


class PollQuestion(models.Model):
    poll = models.ForeignKey(Poll,on_delete=models.CASCADE)
    question = models.CharField(max_length=200)
    def what_i_need_in_ajax_call_for_pollquestion_from_poll(self): #METODO QUE ES UTILIZADO EN VIEWS.PY PARA DEVOLVER LO QUE YO QUIERA DEL OBJETO EN UN LLAMADO AJAX
        return {
            "question": self.question,
            "pk": self.id,
            "options": list(map(lambda x: x.what_i_need_in_ajax_call_for_pollquestionoption_from_pollquestion(),  self.pollquestionoption_set.all()))
        }

class PollQuestionOption(models.Model):
    poll_question = models.ForeignKey(PollQuestion,on_delete=models.CASCADE)
    option = models.CharField(max_length=200)
    def what_i_need_in_ajax_call_for_pollquestionoption_from_pollquestion(self): #METODO QUE ES UTILIZADO EN VIEWS.PY PARA DEVOLVER LO QUE YO QUIERA DEL OBJETO EN UN LLAMADO AJAX
        return {
            "option": self.option,
            "pk": self.id,
        }

class Vote(models.Model):
    poll_question = models.ForeignKey(PollQuestion,on_delete=models.CASCADE)
    question_option = models.ForeignKey(PollQuestionOption,on_delete=models.CASCADE)

class Chat(models.Model):
    user1 = models.ForeignKey(User, on_delete= models.CASCADE, related_name="user1")
    user2 = models.ForeignKey(User, on_delete= models.CASCADE, related_name="user2")

class ChatMessage(models.Model):
    chat = models.ForeignKey(Chat, on_delete= models.CASCADE)
    text = models.CharField(max_length=500)
    userName = models.CharField(max_length=200)

