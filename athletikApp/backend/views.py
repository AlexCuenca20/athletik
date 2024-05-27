from django.views import View
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.views import APIView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.utils.dateparse import parse_datetime, parse_duration
import json
from backend import models


@method_decorator(csrf_exempt, name="dispatch")
class UserView(APIView):
    authentication_classes = [TokenAuthentication, BasicAuthentication]

    def post(self, request):

        data = json.loads(request.body.decode("utf-8"))
        fullname = data.get("name")
        username = data.get("username")
        password = data.get("password")
        email = data.get("email")

        user = User.objects.create_user(
            username=username, email=email, password=password, first_name=fullname
        )
        login(request, user)
        token = Token.objects.create(user=user)

        response = {
            "message": f"Created new user with username: {user.username}",
            "token": str(token),
            "ok": True,
            "status_code": 201,
        }

        return JsonResponse(response, status=response["status_code"])

    def get(self, request):

        if request.user.is_authenticated:
            login(request, request.user)
            response = {
                "message": f"Logged in as: {request.user}",
                "ok": True,
                "status_code": 200,
            }
        else:
            response = {
                "message": "Incorrect token",
                "ok": False,
                "status_code": 401,
            }

        return JsonResponse(response, status=response["status_code"])


@method_decorator(csrf_exempt, name="dispatch")
class ActivityView(APIView):
    authentication_classes = [TokenAuthentication, BasicAuthentication]

    def post(self, request):

        data = json.loads(request.body.decode("utf-8"))
        type = data.get("type")
        distance = int(float(data.get("distance")))
        averageSpeed = float(data.get("averageSpeed"))
        duration = parse_duration(data.get("duration"))
        time = parse_datetime(data.get("time"))
        maxSpeed = float(data.get("maxSpeed"))
        accumulatedDrop = int(float(data.get("accumulatedDrop")))
        routeCoordinates = data.get("routeCoordinates")
        user = request.user

        if request.user.is_authenticated:
            activity = models.Activity.objects.create(
                type=type,
                distance=distance,
                averageSpeed=averageSpeed,
                duration=duration,
                time=time,
                maxSpeed=maxSpeed,
                accumulatedDrop=accumulatedDrop,
                routeCoordinates=routeCoordinates,
                user=user,
            )

            response = {
                "message": f"Created new activity with id: {activity.id}",
                "ok": True,
                "status_code": 201,
            }
        else:
            response = {
                "message": "User is not logged in",
                "ok": False,
                "status_code": 401,
            }

        return JsonResponse(response, status=response["status_code"])


@method_decorator(csrf_exempt, name="dispatch")
class PostView(APIView):
    authentication_classes = [TokenAuthentication, BasicAuthentication]

    def post(self, request):

        data = json.loads(request.body.decode("utf-8"))
        type = data.get("type")
        distance = int(float(data.get("distance")))
        averageSpeed = float(data.get("averageSpeed"))
        duration = parse_duration(data.get("duration"))
        time = parse_datetime(data.get("time"))
        maxSpeed = float(data.get("maxSpeed"))
        accumulatedDrop = int(float(data.get("accumulatedDrop")))
        routeCoordinates = data.get("routeCoordinates")
        title = data.get("title")
        description = data.get("description")
        user = request.user

        if request.user.is_authenticated:
            post = models.Post.objects.create(
                type=type,
                distance=distance,
                averageSpeed=averageSpeed,
                duration=duration,
                time=time,
                maxSpeed=maxSpeed,
                accumulatedDrop=accumulatedDrop,
                routeCoordinates=routeCoordinates,
                title=title,
                description=description,
                user=user,
            )

            response = {
                "message": f"Created new post with id: {post.id}",
                "ok": True,
                "status_code": 201,
            }
        else:
            response = {
                "message": "User is not logged in",
                "ok": False,
                "status_code": 401,
            }

        return JsonResponse(response, status=response["status_code"])

    def get(self, request):

        user_id = request.GET.get("user_id")

        if request.user.is_authenticated:
            if user_id != None:
                allPosts = models.Post.objects.filter(user=request.user)
            else:
                allPosts = models.Post.objects.values()

            allPosts = models.Post.objects.values()

            for post in allPosts:
                post_user_id = post.get("user_id")
                if post_user_id != None:
                    post["username"] = User.objects.get(pk=post_user_id).username

            response = list(allPosts)
        else:
            response = {
                "message": "User is not logged in",
                "ok": False,
                "status_code": 401,
            }

        return JsonResponse(response, safe=False)

    def delete(self, request, id=None):
        post_id = request.GET.get("post_id")
        if request.user.is_authenticated:
            models.Post.objects.filter(id=post_id, user=request.user).delete()

            response = {
                "message": "Deleted post",
                "ok": True,
                "status_code": 200,
            }
        else:
            response = {
                "message": "User is not logged in",
                "ok": False,
                "status_code": 401,
            }

        return JsonResponse(response)

    def put(self, request, id=None):
        data = json.loads(request.body.decode("utf-8"))
        type = data.get("type")
        distance = int(float(data.get("distance")))
        averageSpeed = float(data.get("averageSpeed"))
        duration = parse_duration(data.get("duration"))
        time = parse_datetime(data.get("time"))
        maxSpeed = float(data.get("maxSpeed"))
        accumulatedDrop = int(float(data.get("accumulatedDrop")))
        routeCoordinates = data.get("routeCoordinates")
        title = data.get("title")
        description = data.get("description")

        if request.user.is_authenticated:
            models.Post.objects.filter(id=id, user=request.user).update(
                type=type,
                distance=distance,
                averageSpeed=averageSpeed,
                duration=duration,
                time=time,
                maxSpeed=maxSpeed,
                accumulatedDrop=accumulatedDrop,
                routeCoordinates=routeCoordinates,
                title=title,
                description=description,
            )

            response = {
                "message": f"Modified post with id: {id}",
                "ok": True,
                "status_code": 200,
            }
        else:
            response = {
                "message": "User is not logged in",
                "ok": False,
                "status_code": 401,
            }

        return JsonResponse(response, status=response["status_code"])
