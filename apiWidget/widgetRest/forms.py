from django import forms

from .models import Comment
from .models import User

class CommentForm(forms.ModelForm):

    class Meta:
        model = Comment
        fields = ('comment_text', 'comment_url')

class UserForm(forms.ModelForm):

    class Meta:
        model = User
        fields = ('user_name', 'user_pass')
