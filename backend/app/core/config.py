from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

# Pydantic Settings permet une gestion propre des variables d'environnement
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
    
    # Modèle de configuration pour charger le fichier .env
    # Note: 'backend/.env' sera lu par Docker Compose, mais c'est une bonne pratique pour le dev local
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

      # Nouvelle configuration pour CORS
    CORS_ORIGINS: str = ""

    class Config:
        case_sensitive = True
        env_file = ".env"

# Instanciation unique de la configuration
settings = Settings()