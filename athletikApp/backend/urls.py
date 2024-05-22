from django.urls import path
from .views import UserView, ActivityView, PostView
from rest_framework.authtoken import views

urlpatterns = [
    path("api/v1/users/", UserView.as_view()),
    path("api/v1/activities/", ActivityView.as_view()),
    path("api/v1/posts/", PostView.as_view()),
    path("api/v1/posts/<int:id>/", PostView.as_view()),
    path("api/v1/token-auth/", views.obtain_auth_token),
]
