from django.db import models
from django.conf import settings
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
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )


class Post(Activity):
    title = models.CharField(max_length=60)
    description = models.CharField(max_length=200)
