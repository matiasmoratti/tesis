from django import forms

from .models import Comment, User, SpecificComment




from django.contrib.auth.forms import UserCreationForm
from django.forms import EmailField
from django.utils.translation import ugettext_lazy as _


class LoginForm(forms.Form):
    username = forms.CharField(required = True)
    password = forms.CharField(widget=forms.PasswordInput,required = True)

class UserCreationForm(UserCreationForm):
    email = EmailField(label=_("Email"), required=True,
                       help_text=_("Obligatorio."))

    class Meta:
        model = User
        fields = ("username", "email", "password1", "password2")

    def save(self, commit=True):
        user = super(UserCreationForm, self).save(commit=False)
        user.email = self.cleaned_data["email"]
        if commit:
            user.save()
        return user

class WidgetForm(forms.Form):
    title = forms.CharField(max_length=50,required=True)
    descripcion = forms.CharField(max_length=250,required=True)
    file = forms.FileField(label="Widget project",required=True)
    icon = forms.CharField(max_length=200,required=True)


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ('comment_text', 'comment_url')


class SpecificCommentForm(CommentForm):
    class Meta(CommentForm.Meta):
        model = SpecificComment
        fields = CommentForm.Meta.fields + ('url_tag',)


class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('username', 'password')
