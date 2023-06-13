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
        print(data)

        type = data.get('type')
        distance = int(float(data.get('distance')))
        averageSpeed = float(data.get('averageSpeed'))
        duration = parse_duration(data.get('duration'))
        time = parse_datetime(data.get('time'))
        maxSpeed = float(data.get('maxSpeed'))
        accumulatedDrop = int(float(data.get('accumulatedDrop')))
        routeCoordinates = data.get('routeCoordinates')

        activity = models.Activity.objects.create(
            type=type,
            distance=distance,
            averageSpeed=averageSpeed,
            duration=duration,
            time=time,
            maxSpeed=maxSpeed,
            accumulatedDrop=accumulatedDrop,
            routeCoordinates=routeCoordinates)

        response = {
            'message': f'Created new activity with id: {activity.id}',
            'ok': True,
            'status_code': 201
        }

        return JsonResponse(response, status=response['status_code'])
