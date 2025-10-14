# 1. Image de base: Python 3.11 slim pour une image plus légère
FROM python:3.11-slim as build-stage

# Définition des variables d'environnement (non-sensibles)
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

# Création et définition du répertoire de travail
WORKDIR /app

# 2. Copie du fichier des dépendances et installation
# Le .dockerignore assure que l'environnement virtuel local n'est pas copié
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 3. Copie du code source
COPY app /app/app
COPY alembic.ini /app/
COPY alembic /app/alembic/

# 4. Point d'entrée pour le service de l'application
# Uvicorn démarre l'application FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]