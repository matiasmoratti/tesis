from __future__ import unicode_literals

from django.db import models


# Create your models here.

class User(models.Model):
    user_name = models.CharField(max_length=200)
    user_pass = models.CharField(max_length=50)

    def __str__(self):
        return self.user_name


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


