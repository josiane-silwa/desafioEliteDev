## Bilheteria - Shows & Eventos
<img width="840" height="619" alt="Captura de tela 2026-08-25 163941" src="https://github.com/user-attachments/assets/894fc8d2-f923-4f50-baa4-21b85afcd1b8" />


## 📋 Descrição
Projeto desenvolvido para o desafio do processo seletivo Elite Dev. Que implementa uma aplicação Python, com a construção de uma Plataforma web para descoberta de eventos, reserva/compra de ingressos com QR code e validação na portaria, com três perfis de usuário: Organizador, Cliente e Portaria. Onde um organizador publica eventos e um cliente compra ingressos que são validados na portaria.

## 🛠️ Tecnologias Utilizadas
Stack

Back-end

Python / Django + Django REST Framework
Autenticação por sessão (cookies) + proteção CSRF
SQLite (desenvolvimento) / PostgreSQL (produção)
Integração com a API pública Ticketmaster Discovery para importar eventos reais para o catálogo

Front-end

React + Vite
Material UI (MUI)
React Router

Deploy

Render (Web Service para o back-end + Static Site para o front-end)
<div align="left">
    
[![Minhas Habilidades](https://skillicons.dev/icons?i=nodejs,react,git,vscode,python,mysql,postgres,django,mui
)](https://skillicons.dev)  <img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/djangorest/wordmark.svg" width="60px" height="60px"/>


  </div>

## 🔧 Requisitos
    asgiref==3.12.1
    Django==6.1
    django-cors-headers==4.9.0
    djangorestframework==3.18.0
    psycopg2==2.9.12
    python-decouple==3.8
    sqlparse==0.6.0
    tzdata==2026.3


## 🏗️📐 Arquitetura
    desafioEliteDev/
    ├── app                  # app Django principal (models, views, serializers,
    │                        # services, management commands)
    ├── manage.py
    ├── backend              # settings, urls, wsgi/asgi do projeto Django
    ├── frontend             # aplicação React (Vite)
    ├── requirements.txt
    ├── build.sh             # script de build usado pelo Render
    └── render.yaml          # blueprint de deploy do Render
    ├── README.md
    └── .env

## 📝 Funcionalidades
Cadastro e login com três papéis: Organizador, Cliente e Portaria
Busca pública de eventos (por título, cidade, data)
Organizador: criação e publicação de eventos, definição de mapa de assentos ou pista por quantidade, vínculo com item do catálogo externo (Ticketmaster)
Cliente: reserva de assento/quantidade, pagamento simulado, emissão de ingresso com QR code, "Meus ingressos", compartilhamento de ingresso por link
Portaria: leitura de QR code (câmera) ou digitação manual do código, com validação única (evita reuso do mesmo ingresso)
Prevenção de venda duplicada do mesmo assento

## 📦 Instalação
Siga os passos abaixo para rodar o projeto localmente:

    Clone o repositório:
      git clone https://github.com/josiane-silwa/desafioEliteDev.git

    Acesse o diretório do projeto:
     cd desafioEliteDev
     cd backend
     
    Crie um ambiente virtual python:
      python -m venv .venv
      
    Ative o ambiente:
      # Windows:
        .venv\Scripts\activate
      # Linux/macOS:
        source .venv/bin/activate
        
    Instale as dependências:
      pip install -r requirements.txt
      copy .env.example .env

    Inicie a aplicação backend:
      python manage.py migrate
      python .\manage.py runserver

    Para o frontend (Em outro terminal):
      cd frontend
      npm install
      copy .env.example .env
      npm run dev

     
A aplicação será automaticamente aberta no seu navegador na porta:  http://localhost:5173 -> frontend e  http://localhost:8000 -> backend.
<br><br>

## 📁 Acesso ao projeto
<a href="https://agenteassistentedados.streamlit.app" target="_blank"><span>Clique aqui</span></a> para ver uma demonstração do projeto rodando no Render.


## 🔎❓Observações
O projeto poderia ter melhorias tanto de design como de novas funcionalidades. Atualmente está funcional, simples, mas apresentando os requisitos solicitados.
Utilizei o auxílio das IAs, ChatGPT e Cloude, para o desenvolvimento do projeto da seguinte forma: primeiramente montei os arquivos (models, serializers, urls, etc.) 
de acordo com meu conhecimento e depois passei para as IAs corrigirem e propor soluções. Em alguns momentos também utilizei as pesquisas no google geral(foruns, artigos).
Independente do resultado alcançado no processo, será muito interessante para mim ter o feedback a respeito do projeto. Este foi o primeiro voltado para este assunto.
Foi mais um aprendizado, mais uma oportunidade de crescimento.

<br>
<img width="1206" height="699" alt="Captura de tela 2026-08-25 214749" src="https://github.com/user-attachments/assets/f99aeb7d-1778-4d14-9839-60259caa63ec" />
<img width="1216" height="807" alt="Captura de tela 2026-08-25 214715" src="https://github.com/user-attachments/assets/072a50c9-c166-4673-94a5-c83c4bb96b32" />
<img width="1223" height="401" alt="Captura de tela 2026-08-25 214631" src="https://github.com/user-attachments/assets/e5068788-32e0-4299-bead-bfbd3496a3b5" />
<img width="1204" height="905" alt="Captura de tela 2026-08-25 214526" src="https://github.com/user-attachments/assets/89d4224f-77cf-4512-99e0-fdaa02a04fbe" />
<img width="1221" height="924" alt="Captura de tela 2026-08-25 212527" src="https://github.com/user-attachments/assets/f7f1ed49-88cd-4499-a35f-89c85bcf0386" />

<br><br>
