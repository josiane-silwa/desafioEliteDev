import requests
from django.conf import settings

BASE_URL = "https://app.ticketmaster.com/discovery/v2/events.json"


def buscar_eventos_ticketmaster(keyword="", city="", size=20):
    """Busca eventos na Ticketmaster e devolve uma lista já normalizada
    no formato que o CatalogoExterno espera."""
    params = {
        "apikey": settings.TICKETMASTER_API_KEY,
        "size": size,
        "locale": "*",
        "countryCode": "BR",
    }
    if keyword:
        params["keyword"] = keyword
    if city:
        params["city"] = city

    resp = requests.get(BASE_URL, params=params, timeout=10)
    resp.raise_for_status()
    data = resp.json()

    eventos = data.get("_embedded", {}).get("events", [])
    normalizados = []
    for ev in eventos:
        imagens = ev.get("images", [])
        imagem_url = imagens[0]["url"] if imagens else ""

        classificacoes = ev.get("classifications", [])
        categoria = ""
        if classificacoes:
            segmento = classificacoes[0].get("segment", {})
            categoria = segmento.get("name", "")

        data_origem = None
        datas = ev.get("dates", {}).get("start", {})
        if datas.get("dateTime"):
            data_origem = datas["dateTime"]

        normalizados.append({
            "provider": "ticketmaster",
            "external_id": ev["id"],
            "titulo": ev.get("name", ""),
            "descricao": ev.get("info", "") or ev.get("pleaseNote", ""),
            "imagem_url": imagem_url,
            "categoria": categoria,
            "data_origem": data_origem,
            "dados_json": ev,
        })
    return normalizados