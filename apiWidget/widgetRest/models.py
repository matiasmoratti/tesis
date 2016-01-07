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


