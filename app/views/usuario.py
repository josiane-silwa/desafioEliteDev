from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from rest_framework.permissions import AllowAny
from ..models import User
from ..serializers.usuario import UserSerializer, UserCreateSerializer

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated]
 
    def get_serializer_class(self):
        if self.action == "create":
            return UserCreateSerializer
        return UserSerializer
 
    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]
        return super().get_permissions()
 
    def get_queryset(self):
        if self.request.user.is_staff:
            return User.objects.all()
        return User.objects.filter(pk=self.request.user.pk)
 
    @api_view(['GET'])
    #@permission_classes([AllowAny])
    def meu_perfil(request):
        if request.user.is_authenticated:
            return Response({
            "id": request.user.id,
            "username": request.user.username,
            "role": getattr(request.user, 'role', 'cliente')
        })
        return Response(None, status=200) # Retorna nulo com HTTP 200 se não estiver logado
    
    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        return Response(UserSerializer(request.user).data)
