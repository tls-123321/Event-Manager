from rest_framework import serializers
from .models import User, Event, Booking, Status

class EventSerializer(serializers.ModelSerializer):
    thumbnail_url = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = '__all__'

    def get_thumbnail_url(self, obj):
        request = self.context.get('request')
        if obj.thumbnail:
            url = obj.thumbnail.url
        else:
            url = '/media/nothumbnail.jpeg'
        if request is not None:
            return request.build_absolute_uri(url)
        return url
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class BookingSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        if instance.event.is_past and instance.status == Status.ACTIVE:
            instance.status = Status.EXPIRED
            instance.save(update_fields=["status"])
        return super().to_representation(instance)
    event_title = serializers.CharField(source='event.title', read_only=True)
    event_start_date = serializers.DateTimeField(source='event.startDate', read_only=True)
    event_end_date = serializers.DateTimeField(source='event.endDate', read_only=True)
    event_description = serializers.CharField(source='event.description', read_only=True)
    event_thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = ['code', 'status', 'created_at', 'event_title', 'event_start_date', 'event_end_date', 'event_description', 'event_thumbnail']

    def get_event_thumbnail(self, obj):
        event = obj.event
        request = self.context.get('request')
        if event.thumbnail:
            url = event.thumbnail.url
            if request is not None:
                return request.build_absolute_uri(url)
            return url
        return None

class BookingDetailSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source='event.title', read_only=True)
    event_start_date = serializers.DateTimeField(source='event.startDate', read_only=True)
    event_end_date = serializers.DateTimeField(source='event.endDate', read_only=True)
    event_description = serializers.CharField(source='event.description', read_only=True)
    can_cancel = serializers.SerializerMethodField()
    
    class Meta:
        model = Booking
        fields = ['code', 'status', 'created_at', 'event_title', 'event_start_date', 'event_end_date', 'event_description', 'can_cancel']
    
    def get_can_cancel(self, obj):
        return obj.can_cancel()

class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['event']
    
    def create(self, validated_data):
        user = self.context['request'].user
        event = validated_data['event']
        
        existing_booking = Booking.objects.filter(user=user, event=event, status=Status.ACTIVE).first()
        if existing_booking:
            raise serializers.ValidationError("You already have a booking for this event")
        
        booking = Booking.objects.create(user=user, event=event)
        
        user.add_code(booking.code)
        
        return booking

class BookingCancelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = []
    
    def update(self, instance, validated_data):
        if not instance.can_cancel():
            raise serializers.ValidationError("This booking cannot be canceled")
        
        instance.cancel()
        return instance

    
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data): 
        return User.objects.create_user(**validated_data)




