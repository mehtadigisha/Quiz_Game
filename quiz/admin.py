from django.contrib import admin

# Register your models here.
from .models import Question, UserAnswer

admin.site.register(Question)
admin.site.register(UserAnswer)
