from django.urls import path, include
from rest_framework import routers
from .views import *
from rest_framework.authtoken.views import obtain_auth_token

r = routers.DefaultRouter()
r.register('users', UserViewSet, basename='user')

urlpatterns = [
    path("", include(r.urls)),
    path('token-auth/', obtain_auth_token, name='token-auth'),
    # path('reset_password/', handle_reset),
]