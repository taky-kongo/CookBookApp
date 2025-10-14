from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List
from ...dependencies.db import get_db
from ...schemas.recipe import RecipeBase, RecipeRead, RecipeUpdate
from ...crud import recipe as crud_recipe

router = APIRouter()

# CREATE
@router.post("/", response_model=RecipeRead, status_code=status.HTTP_201_CREATED)
def create_recipe_endpoint(recipe: RecipeBase, db: Session = Depends(get_db)):
    """Crée une nouvelle recette."""
    return crud_recipe.create_recipe(db=db, recipe=recipe)

# READ ALL (Liste)
@router.get("/", response_model=List[RecipeRead])
def read_recipes_endpoint(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    """Récupère la liste de toutes les recettes avec pagination."""
    recipes = crud_recipe.get_recipes(db, skip=skip, limit=limit)
    return recipes

# READ ONE (Détail)
@router.get("/{recipe_id}", response_model=RecipeRead)
def read_recipe_endpoint(recipe_id: int, db: Session = Depends(get_db)):
    """Récupère les détails d'une recette spécifique."""
    db_recipe = crud_recipe.get_recipe(db, recipe_id=recipe_id)
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recette non trouvée")
    return db_recipe

# UPDATE
@router.patch("/{recipe_id}", response_model=RecipeRead)
def update_recipe_endpoint(recipe_id: int, recipe_in: RecipeUpdate, db: Session = Depends(get_db)):
    """Met à jour une recette existante."""
    db_recipe = crud_recipe.get_recipe(db, recipe_id=recipe_id)
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recette non trouvée")
    return crud_recipe.update_recipe(db=db, db_recipe=db_recipe, recipe_in=recipe_in)


# DELETE
@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_recipe_endpoint(recipe_id: int, db: Session = Depends(get_db)):
    """Supprime une recette."""
    db_recipe = crud_recipe.get_recipe(db, recipe_id=recipe_id)
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recette non trouvée")
    crud_recipe.delete_recipe(db=db, db_recipe=db_recipe)
    return {"ok": True}