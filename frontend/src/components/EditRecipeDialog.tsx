import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import recipeService, { type Recipe, type RecipeUpdatePayload } from '../services/recipeService';
import { toast } from "sonner";
import axios from 'axios';

interface EditRecipeDialogProps {
  recipe: Recipe;
  onRecipeUpdated: (updatedRecipe: Recipe) => void;
  children: React.ReactNode;
}

const EditRecipeDialog: React.FC<EditRecipeDialogProps> = ({ recipe, onRecipeUpdated, children }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(recipe.title);
  const [description, setDescription] = useState(recipe.description || '');
  const [prepTime, setPrepTime] = useState(recipe.prep_time?.toString() || '');
  const [ingredientsText, setIngredientsText] = useState(recipe.ingredients.join('\n'));
  const [instructions, setInstructions] = useState(recipe.instructions);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(recipe.title);
      setDescription(recipe.description || '');
      setPrepTime(recipe.prep_time?.toString() || '');
      setIngredientsText(recipe.ingredients.join('\n'));
      setInstructions(recipe.instructions);
      setError(null);
    }
  }, [open, recipe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!title.trim() || !instructions.trim()) {
      setError("Le titre et les instructions sont obligatoires.");
      setIsSubmitting(false);
      return;
    }

    try {
      const ingredients = ingredientsText.split('\n').map(s => s.trim()).filter(Boolean);
      
      const updatedData: RecipeUpdatePayload = {
        title,
        description,
        ingredients,
        instructions,
        prep_time: prepTime ? parseInt(prepTime, 10) : null,
      };

      const updatedRecipe = await recipeService.updateRecipe(recipe.id, updatedData);
      onRecipeUpdated(updatedRecipe);
      toast.success("Recette modifiée avec succès !");
      setOpen(false);
    } catch (err) {
      console.error("Erreur lors de la modification de la recette:", err);
      const errorMessage = axios.isAxiosError(err) 
        ? `Erreur ${err.response?.status}: ${err.response?.data?.detail || 'Inconnue'}`
        : "Impossible de modifier la recette.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>{children}</div>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier la recette</DialogTitle>
          <DialogDescription>
            Mettez à jour les détails de votre recette.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
            {/* All form fields are the same as AddRecipeDialog */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title-edit" className="text-right">Titre</Label>
              <Input id="title-edit" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description-edit" className="text-right">Description</Label>
              <Textarea id="description-edit" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="ingredients-edit" className="text-right">Ingrédients</Label>
              <Textarea id="ingredients-edit" value={ingredientsText} onChange={(e) => setIngredientsText(e.target.value)} className="col-span-3" placeholder="Un ingrédient par ligne" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="instructions-edit" className="text-right">Instructions</Label>
              <Textarea id="instructions-edit" value={instructions} onChange={(e) => setInstructions(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="prep_time-edit" className="text-right">Temps (min)</Label>
              <Input id="prep_time-edit" type="number" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} className="col-span-3" />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRecipeDialog;
