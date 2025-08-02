from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db.models import JSONField
from django.utils import timezone
import string
import random

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    username = models.CharField(max_length=50, null=False)
    email = models.EmailField(unique=True)
    codes = JSONField(default=list, blank=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username

    def add_code(self, code):
        if code not in self.codes:
            self.codes.append(code)
            self.save()

# can be created from admin
class Event(models.Model):
    title = models.CharField(max_length=200, null=False)
    description = models.TextField(blank=True)
    startDate = models.DateTimeField(default=timezone.now, null=False)
    endDate = models.DateTimeField(null=False)
    thumbnail = models.ImageField(upload_to='event_thumbnails/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-startDate']

    @property
    def is_upcoming(self):
        return self.startDate > timezone.now()

    @property
    def is_ongoing(self):
        now = timezone.now()
        return self.startDate <= now <= self.endDate

    @property
    def is_past(self):
        return self.endDate < timezone.now()

    @property
    def duration_days(self):
        return (self.endDate - self.startDate).days

    def can_be_canceled(self):
        now = timezone.now()
        return (self.duration_days <= 2 and 
                (self.startDate - now).days >= 2)
    

class Status(models.TextChoices):
    ACTIVE = 'Active', 'Active'
    CANCELED = 'Canceled', 'Canceled'
    EXPIRED = 'Expired', 'Expired'

def generate_booking_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))

class Booking(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='bookings')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings', null=True, blank=True)
    code = models.CharField(max_length=10, primary_key=True, default=generate_booking_code)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.ACTIVE)
    created_at = models.DateTimeField(auto_now_add=True)
    canceled_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Booking {self.code} for {self.event.title}"

    def save(self, *args, **kwargs):
        if not self.code:
            self.code = generate_booking_code()
        super().save(*args, **kwargs)

    def can_cancel(self):
        if self.status != Status.ACTIVE:
            return False
        return self.event.can_be_canceled()

    def cancel(self):
        if self.can_cancel():
            self.status = Status.CANCELED
            self.canceled_at = timezone.now()
            self.save()
            return True
        return False

    class Meta:
        ordering = ['-created_at']