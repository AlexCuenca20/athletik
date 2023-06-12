from django.db import models
from jsonfield import JSONField


class Activity(models.Model):
    type = models.CharField(max_length=30)
    distance = models.IntegerField()
    averageSpeed = models.FloatField()
    duration = models.DurationField()
    time = models.DateTimeField()
    maxSpeed = models.FloatField()
    accumulatedDrop = models.IntegerField()
    routeCoordinates = JSONField()


class Post(Activity):
    title = models.CharField(max_length=60)
    description = models.CharField(max_length=200)
