from django.urls import path
from .views import UserView, ActivityView

urlpatterns = [
    path('api/v1/users/', UserView.as_view()),
    path('api/v1/activities/', ActivityView.as_view()),
]