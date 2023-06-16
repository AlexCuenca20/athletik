from django.views import View
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.utils.dateparse import parse_datetime, parse_duration
import json
from backend import models


@method_decorator(csrf_exempt, name='dispatch')
class UserView(View):

    def post(self, request):

        data = json.loads(request.body.decode("utf-8"))
        fullname = data.get('name')
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')

        user = User.objects.create_user(username=username,
                                        email=email,
                                        password=password,
                                        first_name=fullname)
        login(request, user)

        response = {
            'message': f'Created new user with username: {user.username}',
            'ok': True,
            'status_code': 201
        }

        return JsonResponse(response, status=response['status_code'])

    def get(self, request):

        username = request.GET.get('username')
        password = request.GET.get('password')

        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            response = {
                'message': f'Logged in as: {user.username}',
                'ok': True,
                'status_code': 200
            }
        else:
            response = {
                'message': 'Incorrect username or password',
                'ok': False,
                'status_code': 401
            }

        return JsonResponse(response, status=response['status_code'])


@method_decorator(csrf_exempt, name='dispatch')
class ActivityView(View):

    def post(self, request):

        data = json.loads(request.body.decode("utf-8"))
        type = data.get('type')
        distance = int(float(data.get('distance')))
        averageSpeed = float(data.get('averageSpeed'))
        duration = parse_duration(data.get('duration'))
        time = parse_datetime(data.get('time'))
        maxSpeed = float(data.get('maxSpeed'))
        accumulatedDrop = int(float(data.get('accumulatedDrop')))
        routeCoordinates = data.get('routeCoordinates')
        user = request.user

        activity = models.Activity.objects.create(
            type=type,
            distance=distance,
            averageSpeed=averageSpeed,
            duration=duration,
            time=time,
            maxSpeed=maxSpeed,
            accumulatedDrop=accumulatedDrop,
            routeCoordinates=routeCoordinates,
            user=user)

        response = {
            'message': f'Created new activity with id: {activity.id}',
            'ok': True,
            'status_code': 201
        }

        return JsonResponse(response, status=response['status_code'])


@method_decorator(csrf_exempt, name='dispatch')
class PostView(View):

    def post(self, request):

        data = json.loads(request.body.decode("utf-8"))
        type = data.get('type')
        distance = int(float(data.get('distance')))
        averageSpeed = float(data.get('averageSpeed'))
        duration = parse_duration(data.get('duration'))
        time = parse_datetime(data.get('time'))
        maxSpeed = float(data.get('maxSpeed'))
        accumulatedDrop = int(float(data.get('accumulatedDrop')))
        routeCoordinates = data.get('routeCoordinates')
        title = data.get('title')
        description = data.get('description')
        user = request.user

        post = models.Post.objects.create(type=type,
                                          distance=distance,
                                          averageSpeed=averageSpeed,
                                          duration=duration,
                                          time=time,
                                          maxSpeed=maxSpeed,
                                          accumulatedDrop=accumulatedDrop,
                                          routeCoordinates=routeCoordinates,
                                          title=title,
                                          description=description,
                                          user=user)

        response = {
            'message': f'Created new post with id: {post.id}',
            'ok': True,
            'status_code': 201
        }

        return JsonResponse(response, status=response['status_code'])

    def get(self, request):

        allPosts = models.Post.objects.values()

        for post in allPosts:
            user_id = post.get('user_id')
            if (user_id != None):
                post['username'] = User.objects.get(
                    pk=post.get('user_id')).username

        response = list(allPosts)

        return JsonResponse(response, safe=False)

    def delete(self, request, id=None):
        models.Post.objects.filter(id=id).delete()

        data = {"message": "Post deleted"}

        return JsonResponse(data)
