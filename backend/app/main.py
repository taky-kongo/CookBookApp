from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api.v1 import recipes # NOUVEL IMPORT

# Création de l'application FastAPI
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    version="1.0.0",
    root_path="/api"
)

# Configuration de CORS (Cross-Origin Resource Sharing) [cite: 74]
# Essentiel pour que le frontend (localhost:3000) puisse communiquer avec le backend
if settings.CORS_ORIGINS:
    origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",")]
else:
    origins = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route de base pour vérifier que l'API fonctionne
@app.get("/")
def read_root():
    return {"message": "Welcome to CookBook API v1! Check /docs for documentation."}

# Inclure les routers des différentes fonctionnalités (ex: Recettes) ici plus tard
# app.include_router(recipe_router, prefix=settings.API_V1_STR)

app.include_router(recipes.router, prefix="/v1/recipes", tags=["recipes"])


# INCLUSION DU ROUTER DES RECETTES
# app.include_router(recipes.router, prefix=settings.API_V1_STR + "/recipes", tags=["recipes"])