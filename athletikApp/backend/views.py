from django.views import View
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
import json


@method_decorator(csrf_exempt, name='dispatch')
class UserView(View):

    def post(self, request):

        data = json.loads(request.body.decode("utf-8"))
        fullname = data.get('name')
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')

        user = User.objects.create_user(username,
                                        email,
                                        password,
                                        first_name=fullname)
        authenticate(username, password)

        response = {
            'message': f'Created new user with username: {user.username}',
            'ok': True,
            'status_code': 201
        }

        return JsonResponse(response)


#   def get(self, request, username):

    def get(self, request):

        username = request.GET.get('username')
        password = request.GET.get('password')

        user = authenticate(username=username, password=password)
        if user is not None:
            response = {
                'message': f'Logged in as: {user.username}',
                'ok': True,
                'status_code': 200
            }
        else:
            response = {
                'message': f'Incorrect username or password',
                'ok': False,
                'status_code': 401
            }

        return JsonResponse(response)
