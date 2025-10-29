import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import recipeService, { type Recipe } from '../services/recipeService';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import AddRecipeDialog from '@/components/AddRecipeDialog';
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const RecipeList: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const data = await recipeService.getAllRecipes();
        setRecipes(data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors de la récupération des recettes:", err);
        setError("Impossible de charger les recettes depuis l'API.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleRecipeAdded = (newRecipe: Recipe) => {
    setRecipes([newRecipe, ...recipes]);
    toast.success(`Recette "${newRecipe.title}" ajoutée avec succès !`);
  };

  const handleDelete = async (id: number) => {
    try {
      await recipeService.deleteRecipe(id);
      setRecipes(recipes.filter((recipe) => recipe.id !== id));
      toast.success("Recette supprimée !");
    } catch (err) {
      console.error("Erreur lors de la suppression de la recette:", err);
      toast.error("Impossible de supprimer la recette.");
    }
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Chargement des recettes...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold shrink-0">My Cookbook</h1>
        <div className="w-full max-w-md">
          <Input
            type="search"
            placeholder="Rechercher une recette..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <AddRecipeDialog onRecipeAdded={handleRecipeAdded}>
          <Button>Ajouteer une Recette</Button>
        </AddRecipeDialog>
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="text-center text-gray-500 py-16">
          <p>{recipes.length > 0 ? `Aucune recette trouvée pour "${searchTerm}".` : 'Aucune recette trouvée.'}</p>
          {recipes.length === 0 && <p>Cliquez sur "Ajouter une Recette" pour créer votre première recette !</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRecipes.map((recipe) => (
            <Card key={recipe.id} className="flex flex-col">
              {/* On pourra ajouter une image ici plus tard */}
              <CardHeader>
                <CardTitle>{recipe.title}</CardTitle>
                <CardDescription>{recipe.description || 'Pas de description'}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">
                  Temps de préparation : {recipe.prep_time || 'N/A'} min
                </p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/recipe/${recipe.id}`}>Voir</Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">Supprimer</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. La recette "{recipe.title}" sera définitivement supprimée.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(recipe.id)}>
                        Confirmer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeList;
