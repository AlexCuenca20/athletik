from django.contrib import admin
from .models import Activity, Post

admin.site.register(Post)
admin.site.register(Activity)