from rest_framework.viewsets import ModelViewSet
from .serializers import *
from .models import *
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action in ['create', 'check_email', 'login']:
            permission_classes = [AllowAny]
        else: 
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            token = Token.objects.create(user=serializer.instance)
            return_data = { 'user': serializer.data, 'token': token.key }
            return Response(return_data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def check_email(self, request):
        try:
            user = User.objects.filter(email = request.data['email'])
            if len(user) == 0:
                # return false if user does not exist
                return Response({'user_exists':'false'}, status=status.HTTP_200_OK)
            # return true if user does exist
            return Response({'user_exists':'true'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        try:
            username = request.data.get("email")
            password = request.data.get("password")
            if username is None or password is None:
                return Response({'error': 'Please provide both username and password'}, status=status.HTTP_400_BAD_REQUEST)
            user = authenticate(username=username, password=password)
            if user:
                user_serial = UserSerializer(user)
                token = Token.objects.get(user=user)
                data = {
                    'user': user_serial.data,
                    'token': token.key
                }
                return Response(data, status=status.HTTP_202_ACCEPTED)
            else:
                return Response({'error': 'Email and password combination not recognized'}, status=status.HTTP_403_FORBIDDEN)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

