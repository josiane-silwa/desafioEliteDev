from django.core.management.base import BaseCommand
from app.models import CatalogoExterno
from app.services.ticketmaster import buscar_eventos_ticketmaster


class Command(BaseCommand):
    help = "Busca eventos na Ticketmaster e salva/atualiza no CatalogoExterno"

    def add_arguments(self, parser):
        parser.add_argument("--keyword", default="", help="Termo de busca (ex: show, teatro)")
        parser.add_argument("--city", default="", help="Cidade (ex: Sao Paulo)")
        parser.add_argument("--size", type=int, default=20)

    def handle(self, *args, **options):
        itens = buscar_eventos_ticketmaster(
            keyword=options["keyword"],
            city=options["city"],
            size=options["size"],
        )

        criados, atualizados = 0, 0
        for item in itens:
            obj, created = CatalogoExterno.objects.update_or_create(
                provider=item["provider"],
                external_id=item["external_id"],
                defaults={
                    "titulo": item["titulo"],
                    "descricao": item["descricao"],
                    "imagem_url": item["imagem_url"],
                    "categoria": item["categoria"],
                    "data_origem": item["data_origem"],
                    "dados_json": item["dados_json"],
                },
            )
            criados += created
            atualizados += not created

        self.stdout.write(self.style.SUCCESS(
            f"OK: {criados} criados, {atualizados} atualizados."
        ))