from django.urls import path
from .views import UserView

urlpatterns = [
    path('api/v1/users/', UserView.as_view()),
]