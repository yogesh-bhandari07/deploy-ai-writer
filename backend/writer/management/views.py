from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from management.serializers import *
from django.contrib.auth import authenticate
from management.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .models import *
from django.http import HttpResponseRedirect
import openai

# Generate Token Manually


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
# auth


class UserRegistrationView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # token = get_tokens_for_user(user)
        
        a=SendEmailVerifyLinkSerializer(data={'email':request.data['email']})
        a.is_valid(raise_exception=True)

        return Response({'message': 'Account Verification link has sent on your email'}, status=status.HTTP_201_CREATED)

 
class VerifyUserEmailView(APIView):
    renderer_classes = [UserRenderer]
    def get(self,request,uid, token, format=None):
        
        serializer=VerifyEmailSerializer(data=request.data, context={'uid': uid, 'token': token})
        serializer.is_valid(raise_exception=True)

        return HttpResponseRedirect(redirect_to=os.getenv('WEB_URL')+'login')


class UserLoginView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.data.get('email')
        password = serializer.data.get('password')
        user = authenticate(email=email, password=password)
        
        if user is not None:
            if user.is_verified:
                token = get_tokens_for_user(user)
                return Response({'token': token, 'msg': 'Login Success', 'user': {'name': user.name, 'email': user.email}}, status=status.HTTP_200_OK)
            else:
                return Response({'errors': {'message': 'Please Verify your account'}}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({'errors': {'non_field_errors': ['Email or Password is not Valid']}}, status=status.HTTP_404_NOT_FOUND)


class UserProfileView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserChangePasswordView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = UserChangePasswordSerializer(
            data=request.data, context={'user': request.user})
        serializer.is_valid(raise_exception=True)
        return Response({'msg': 'Password Changed Successfully'}, status=status.HTTP_200_OK)


class SendPasswordResetEmailView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        serializer = SendPasswordResetEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'msg': 'Password Reset link send. Please check your Email'}, status=status.HTTP_200_OK)


class UserPasswordResetView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, uid, token, format=None):
        serializer = UserPasswordResetSerializer(
            data=request.data, context={'uid': uid, 'token': token})
        serializer.is_valid(raise_exception=True)
        return Response({'msg': 'Password Reset Successfully'}, status=status.HTTP_200_OK)


class UserView(APIView):
    def get(self, request, pk=None, format=None):
        id = pk
        if id is not None:
            module = User.objects.get(id=id)
            serializer = UserSerializer(module)
            return Response(serializer.data)
        modules = User.objects.filter(is_admin=False)
        serializer = UserSerializer(modules, many=True)
        return Response({"msg": 'Data Fetched', "data": serializer.data}, status=status.HTTP_200_OK)

    def put(self, request, pk, format=None):
        id = pk
        module = User.objects.get(id=id)
        serializer = UserSerializer(module, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"msg": 'Data updated', "data": serializer.data}, status=status.HTTP_200_OK)

    def patch(self, request, pk, format=None):
        id = pk
        module = User.objects.get(id=id)
        serializer = UserSerializer(module, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"msg": 'Data updated partially', "data": serializer.data}, status=status.HTTP_200_OK)

    def delete(self, request, pk, format=None):
        id = pk
        module = User.objects.get(id=id)
        module.delete()
        return Response({
            "msg": "Data has been deleted"
        }, status=status.HTTP_200_OK)


class PostView(APIView):
    renderer_classes = [UserRenderer]
    def post(self, request, format=None):
        serializer=PostSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        openai.api_key = os.getenv('OPEN_AI_API_KEY')
        response = openai.Completion.create(
        model="text-davinci-003",
        prompt=request.data['title'],
        temperature=0.7,
        max_tokens=1024,
        # top_p=1,
        # frequency_penalty=0.0,
        # presence_penalty=0.6,
       
        )
        return Response({'msg':'Data Fetched','content':response.choices[0]['text']},status=status.HTTP_200_OK)

class TitlesView(APIView):
    renderer_classes = [UserRenderer]
    def post(self, request, format=None):
        serializer=PostSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        openai.api_key = os.getenv('OPEN_AI_API_KEY')
        response = openai.Completion.create(
        model="text-davinci-003",
        prompt=request.data['title'],
        temperature=0.7,
        max_tokens=1024,

        )
        s1=response.choices[0]['text']
        s1=s1.split('\n\n')[1]
        print('####################################################',s1)
        s2=s1.split('\n')
        
        resL=[]
        for i in s2:
            res={}
            res['id']=i.split('. ')[0]
            res['value']=i.split('. ')[1]
            resL.append(res)
            

        return Response({'msg':'Data Fetched','content':resL},status=status.HTTP_200_OK)

