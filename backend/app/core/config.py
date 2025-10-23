from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


# Pydantic Settings (pydantic v2) pour la gestion des variables d'environnement
class Settings(BaseSettings):
    """Configuration de l'application chargée depuis les variables d'environnement."""

    # Préfixe de la version de l'API
    API_V1_STR: str = "/api/v1"

    # Nom du projet pour la documentation Swagger/OpenAPI
    PROJECT_NAME: str = "CookBook API"

    # Configuration de la base de données
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_SERVER: str
    POSTGRES_DB: str
    DATABASE_URL: str | None = None

    # Nouvelle configuration pour CORS
    CORS_ORIGINS: str = ""

    # model_config pour pydantic-settings : charger .env
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


# Instanciation unique de la configuration
settings = Settings()