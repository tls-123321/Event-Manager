from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView



urlpatterns = [
    path('events/', views.EventListView.as_view(), name="events"),
    path('events/<int:pk>/', views.EventDetailsView.as_view(), name="event"),

    path('profile/me/', views.CurrentUserView.as_view(), name="current-user"),
    path('profile/register/', views.RegisterView.as_view(), name="register"),
    path('profile/edit/', views.ProfileUpdateView.as_view(), name="profile-edit"),
    path('profile/login/', views.LoginView.as_view(), name="login"),
    path('profile/logout/', views.LogoutView.as_view(), name="logout"),
    
    path('bookings/', views.UserBookingsView.as_view(), name="user-bookings"),
    path('bookings/create/', views.CreateBookingView.as_view(), name="create-booking"),
    path('bookings/<str:code>/', views.BookingDetailView.as_view(), name="booking-detail"),
    path('bookings/<str:code>/cancel/', views.CancelBookingView.as_view(), name="cancel-booking"),
    
]