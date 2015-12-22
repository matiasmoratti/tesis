from django import forms

from .models import Comment, User, SpecificComment


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
        fields = ('user_name', 'user_pass')
