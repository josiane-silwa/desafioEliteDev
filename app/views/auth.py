from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from ..serializers.usuario import UserSerializer
from rest_framework import status

@method_decorator(ensure_csrf_cookie, name="dispatch")
class CsrfCookieView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"detail": "Cookie CSRF definido."})


class LoginView(APIView):
    permission_classes = [AllowAny]


    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")


        if not username or not password:
            return Response(
                {
                    "detail": "Usuário e senha são obrigatórios."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


        user = authenticate(
            request,
            username=username,
            password=password,
        )


        if user is None:
            return Response(
                {
                    "detail": "Usuário ou senha inválidos."
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )


        login(request, user)


        return Response(
            {
                "detail": "Login realizado com sucesso.",
                "user": UserSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]


    def post(self, request):
        logout(request)


        return Response(
            {
                "detail": "Logout realizado com sucesso."
            },
            status=status.HTTP_200_OK,
        )
