from typing import List, Optional
from sqlmodel import Session, select
from ..schemas.recipe import Recipe, RecipeBase, RecipeUpdate

def get_recipes(db: Session, skip: int = 0, limit: int = 20) -> List[Recipe]:
    """Lecture: Récupère une liste de recettes (avec pagination)"""
    # Utilisation de select(Recipe) est l'approche moderne de SQLAlchemy 2.0
    return db.exec(select(Recipe).offset(skip).limit(limit)).all()

def get_recipe(db: Session, recipe_id: int) -> Optional[Recipe]:
    """Lecture: Récupère les détails d'une recette par ID"""
    return db.get(Recipe, recipe_id)

def create_recipe(db: Session, recipe: RecipeBase) -> Recipe:
    """Création: Ajoute une nouvelle recette"""
    # Crée une instance de Recipe à partir des données Pydantic
    db_recipe = Recipe.model_validate(recipe)
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe) # Récupère l'ID généré par la BDD
    return db_recipe

def update_recipe(db: Session, db_recipe: Recipe, recipe_in: RecipeUpdate) -> Recipe:
    """Mise à jour: Modifie une recette existante"""
    # Merge les données entrantes avec l'objet existant
    update_data = recipe_in.model_dump(exclude_unset=True)
    db_recipe.sqlmodel_update(update_data)
    
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe

def delete_recipe(db: Session, db_recipe: Recipe) -> Recipe:
    """Suppression: Supprime une recette"""
    db.delete(db_recipe)
    db.commit()
    return db_recipe