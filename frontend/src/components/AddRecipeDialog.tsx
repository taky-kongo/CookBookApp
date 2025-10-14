import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import recipeService, { type Recipe } from '../services/recipeService';
import axios from 'axios';

interface AddRecipeDialogProps {
  children: React.ReactNode;
  onRecipeAdded: (newRecipe: Recipe) => void;
}

const AddRecipeDialog: React.FC<AddRecipeDialogProps> = ({ children, onRecipeAdded }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [ingredientsText, setIngredientsText] = useState('');
  const [instructions, setInstructions] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!title.trim()) {
      setError("Le titre est obligatoire.");
      setIsSubmitting(false);
      return;
    }

    if (!instructions.trim()) {
      setError("Les instructions sont obligatoires.");
      setIsSubmitting(false);
      return;
    }

    try {
      const ingredients = ingredientsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const newRecipeData = {
        title,
        description,
        ingredients,
        instructions,
        prep_time: prepTime ? parseInt(prepTime, 10) : null,
      };
      const savedRecipe = await recipeService.createRecipe(newRecipeData as any);
      onRecipeAdded(savedRecipe);
      
      // Reset form and close dialog
      setTitle('');
      setDescription('');
      setPrepTime('');
      setIngredientsText('');
      setInstructions('');
      setOpen(false);
    } catch (err) {
      console.error("Erreur lors de la création de la recette:", err);

      // Detailed Axios error handling
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const data = err.response?.data;
        setError(`Erreur ${status}: ${data?.detail || JSON.stringify(data)}`);
      } else {
        setError("Impossible de créer la recette. Veuillez réessayer.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle recette</DialogTitle>
          <DialogDescription>
            Remplissez les détails de votre nouvelle recette. Cliquez sur "Enregistrer" pour l'ajouter.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Titre
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                placeholder="Une brève description de la recette..."
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="ingredients" className="text-right">
                Ingrédients
              </Label>
              <Textarea
                id="ingredients"
                value={ingredientsText}
                onChange={(e) => setIngredientsText(e.target.value)}
                className="col-span-3"
                placeholder="Un ingrédient par ligne"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="instructions" className="text-right">
                Instructions
              </Label>
              <Textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="col-span-3"
                placeholder="Étapes de préparation..."
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="prep_time" className="text-right">
                Temps (min)
              </Label>
              <Input
                id="prep_time"
                type="number"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRecipeDialog;
