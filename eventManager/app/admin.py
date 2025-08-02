from django.contrib import admin
from .models import User, Event, Booking

admin.site.register(User)
admin.site.register(Event)
admin.site.register(Booking)