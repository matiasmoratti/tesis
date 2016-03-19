from django.contrib import admin

# Register your models here.
from .models import Comment,SpecificComment,User, UserActiveUrl,Poll,PollQuestion,PollQuestionOption,Chat,ChatMessage,Vote, Widget, Element

admin.site.register(Comment)
admin.site.register(SpecificComment)
admin.site.register(UserActiveUrl)
admin.site.register(Poll)
admin.site.register(PollQuestion)
admin.site.register(PollQuestionOption)
admin.site.register(Chat)
admin.site.register(ChatMessage)
admin.site.register(Vote)
admin.site.register(Widget)
admin.site.register(Element)

