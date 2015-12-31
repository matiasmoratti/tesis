from django.contrib import admin

# Register your models here.
from .models import Comment,SpecificComment,User, UserActiveUrl

admin.site.register(Comment)
admin.site.register(SpecificComment)
admin.site.register(User)
admin.site.register(UserActiveUrl)
