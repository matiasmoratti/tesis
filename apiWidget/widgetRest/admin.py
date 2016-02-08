from django.contrib import admin

# Register your models here.
from .models import Comment,SpecificComment,User, UserActiveUrl,Poll,PollQuestion,PollQuestionOption

admin.site.register(Comment)
admin.site.register(SpecificComment)
admin.site.register(UserActiveUrl)
admin.site.register(Poll)
admin.site.register(PollQuestion)
admin.site.register(PollQuestionOption)

