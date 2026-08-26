from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from app.models import Portaria

User = get_user_model()


class Command(BaseCommand):
    help = (
        "Cria usuarios de teste (admin/organizador, cliente, portaria) e "
        "vincula a portaria como ativa. Seguro rodar varias vezes: so cria "
        "o que ainda nao existe."
    )

    def handle(self, *args, **options):
        # --- Superusuario / organizador ---
        admin, criado = User.objects.get_or_create(
            username="admin",
            defaults={
                "email": "admin@bilheteria.com",
                "role": "organizador",
                "is_staff": True,
                "is_superuser": True,
                "cpf": "00000000000",
            },
        )
        if criado:
            admin.set_password("TrocarSenha@123")
            admin.save()
            self.stdout.write(self.style.SUCCESS("Superusuario 'admin' criado (senha: TrocarSenha@123)."))
        else:
            self.stdout.write("Superusuario 'admin' ja existe, nada a fazer.")

        # --- Cliente de teste ---
        cliente, criado = User.objects.get_or_create(
            username="cliente_teste",
            defaults={
                "email": "cliente@bilheteria.com",
                "role": "cliente",
                "cpf": "11111111111",
            },
        )
        if criado:
            cliente.set_password("Teste@123")
            cliente.save()
            self.stdout.write(self.style.SUCCESS("Cliente 'cliente_teste' criado (senha: Teste@123)."))

        # --- Portaria de teste ---
        portaria_user, criado = User.objects.get_or_create(
            username="portaria_teste",
            defaults={
                "email": "portaria@bilheteria.com",
                "role": "portaria",
                "cpf": "22222222222",
            },
        )
        if criado:
            portaria_user.set_password("Teste@123")
            portaria_user.save()
            self.stdout.write(self.style.SUCCESS("Portaria 'portaria_teste' criado (senha: Teste@123)."))

        _, vinculo_criado = Portaria.objects.get_or_create(
            usuario=portaria_user, defaults={"ativo": True}
        )
        if vinculo_criado:
            self.stdout.write(self.style.SUCCESS("Vinculo de portaria ativado."))

        self.stdout.write(self.style.SUCCESS("Seed de producao concluido."))