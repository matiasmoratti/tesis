from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User

# Create your models here.



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

class PollQuestion(models.Model):
    poll = models.ForeignKey(Poll,on_delete=models.CASCADE)
    question = models.CharField(max_length=200)

class PollQuestionOption(models.Model):
    poll_question = models.ForeignKey(PollQuestion,on_delete=models.CASCADE)
    option = models.CharField(max_length=200)
    votes = models.IntegerField()

class Chat(models.Model):
    user1 = models.ForeignKey(User, on_delete= models.CASCADE, related_name="user1")
    user2 = models.ForeignKey(User, on_delete= models.CASCADE, related_name="user2")

class ChatMessage(models.Model):
    chat = models.ForeignKey(Chat, on_delete= models.CASCADE)
    text = models.CharField(max_length=500)
    userName = models.CharField(max_length=200)

