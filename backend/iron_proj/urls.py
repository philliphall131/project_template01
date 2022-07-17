from django.contrib import admin
from django.urls import path, include
from .view import send_the_homepage

urlpatterns = [
    path('admin/', admin.site.urls), # this will direct to the django admin page
    path('', send_the_homepage), # this will serve the react frontend build
    path('api/', include('iron_app.urls')) # this will direct to the DRF backend API
]
