from pathlib import Path
from django.conf import settings
from django.http import HttpResponse


def spa_view(request):
    index_path = Path(settings.BASE_DIR) / "frontend" / "dist" / "index.html"
    return HttpResponse(index_path.read_text(encoding="utf-8"), content_type="text/html")