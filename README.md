## Bilheteria - Shows & Eventos
<img width="840" height="619" alt="Captura de tela 2026-08-25 163941" src="https://github.com/user-attachments/assets/894fc8d2-f923-4f50-baa4-21b85afcd1b8" />


## 📋 Descrição
Projeto desenvolvido para o desafio do processo seletivo Elite Dev. Que implementa uma aplicação Python, com a construção de uma Plataforma de Eventos e Ingressos, 
onde um organizador publica eventos e um cliente compra ingressos.

## 🛠️ Tecnologias Utilizadas
<div align="left">
    
[![Minhas Habilidades](https://skillicons.dev/icons?i=nodejs,react,git,vscode,python,mysql,postgres,django
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
    ├── documentos/
    │   └── dados_entrega_modificado.csv     # Dataframe de dados
    ├── App                               # Interface de chat (Streamlit)
    ├── backend                       # Construção das ferramentas - Orquestração - Geração de respostas
    ├── frontend                       # Construção das ferramentas - Orquestração - Geração de respostas
    ├── requirements.txt
    ├── README.md
    └── .env
    desafio-elite-dev/
│
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   │
│   └── events/
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── services.py
│       ├── permissions.py
│       └── urls.py
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│
├── README.md
└── .gitignore

    
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
<img width="1919" height="974" alt="Captura de tela 2026-08-19 171741" src="https://github.com/user-attachments/assets/0a1dc5d7-678d-4c5a-902c-66355d62a28a" />
<br><br>
