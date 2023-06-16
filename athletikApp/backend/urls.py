from django.urls import path
from .views import UserView, ActivityView, PostView

urlpatterns = [
    path('api/v1/users/', UserView.as_view()),
    path('api/v1/activities/', ActivityView.as_view()),
    path('api/v1/posts/', PostView.as_view()),
    path('api/v1/posts/<int:id>/', PostView.as_view()),
]