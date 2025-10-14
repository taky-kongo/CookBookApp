from typing import Optional, List
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship, JSON, Column
from pydantic import BaseModel, root_validator
from sqlalchemy.dialects.postgresql import JSONB

# Modèle de base pour l'API (validation)
class RecipeBase(SQLModel):
    """
    Schéma de base pour la création et la lecture des recettes,
    assurant que les champs obligatoires sont présents.
    """
    title: str = Field(index=True, max_length=100) # Titre (obligatoire) [cite: 54]
    description: Optional[str] = Field(default=None) # Description (optionnel) [cite: 55]

     # Ingrédients stockés en JSON/JSONB dans la BDD
    ingredients: List[str] = Field(sa_column=Column(JSONB), default=[]) # Ingrédients (obligatoire) [cite: 56]
    
    instructions: str = Field() # Instructions (obligatoire) [cite: 57]
    
    prep_time: Optional[int] = Field(default=None, ge=0) # Temps de préparation (minutes)
    cook_time: Optional[int] = Field(default=None, ge=0) # Temps de cuisson (minutes)
    servings: Optional[int] = Field(default=None, ge=1) # Nombre de portions

# Modèle de BDD complet (hérite de la base)
class Recipe(RecipeBase, table=True):
    """
    Modèle ORM de la recette pour la base de données.
    """
    __tablename__ = "recipes"

    id: Optional[int] = Field(default=None, primary_key=True) # ID (auto-incrémenté)

    # Horodatages automatiques
    created_at: datetime = Field(default_factory=datetime.utcnow) # Date de création
    updated_at: datetime = Field(default_factory=datetime.utcnow) # Date de mise à jour

    # Utilisation d'un 'pre_update' ou d'un déclencheur DB pour garantir l'update_at
    # Pour l'instant, on laisse le client le gérer lors de la mise à jour (schéma Update)
    
# Schémas Pydantic pour l'API (Lecture et Mise à Jour)
# Note: SQLModel fournit déjà RecipeBase pour la Création

class RecipeRead(RecipeBase):
    """Schéma de sortie (READ) avec l'ID et les dates."""
    id: int
    created_at: datetime
    updated_at: datetime

class RecipeUpdate(RecipeBase):
    """Schéma pour la mise à jour (tous les champs optionnels)."""
    title: Optional[str] = None
    description: Optional[str] = None
    ingredients: Optional[List[str]] = None
    instructions: Optional[str] = None
    prep_time: Optional[int] = None
    cook_time: Optional[int] = None
    servings: Optional[int] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow) # Mise à jour de la date