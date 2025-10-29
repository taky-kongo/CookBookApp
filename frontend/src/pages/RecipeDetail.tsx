import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import recipeService, { type Recipe } from '../services/recipeService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Pencil } from 'lucide-react';
import EditRecipeDialog from '@/components/EditRecipeDialog';

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await recipeService.getRecipeById(parseInt(id, 10));
        setRecipe(data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors de la récupération de la recette:", err);
        setError("Impossible de charger la recette. L'ID est peut-être incorrect ou l'API est indisponible.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleRecipeUpdated = (updatedRecipe: Recipe) => {
    setRecipe(updatedRecipe);
  };

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Chargement de la recette...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">{error}</div>;
  }

  if (!recipe) {
    return <div className="container mx-auto p-4 text-center">Recette non trouvée.</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Button asChild variant="outline" className="mb-8">
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la liste
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-4xl font-bold">{recipe.title}</CardTitle>
              <CardDescription className="pt-2">{recipe.description || 'Pas de description'}</CardDescription>
            </div>
            <EditRecipeDialog recipe={recipe} onRecipeUpdated={handleRecipeUpdated}>
              <Button variant="outline" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </EditRecipeDialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-8 text-sm text-muted-foreground">
            <span>Temps de préparation : {recipe.prep_time || 'N/A'} mins</span>
            {/* Vous pouvez ajouter d'autres infos comme cook_time, servings ici */}
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Ingrédients</h3>
            <ul className="list-disc list-inside bg-slate-100 dark:bg-slate-900 p-4 rounded-md">
              {recipe.ingredients?.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              )) || <li>Aucun ingrédient listé.</li>}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Instructions</h3>
            {recipe.instructions ? (
              <ol className="list-decimal list-inside space-y-4 prose dark:prose-invert max-w-none">
                {recipe.instructions.split('\n').filter(step => step.trim() !== '').map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            ) : (
              <p className="text-muted-foreground">Aucune instruction fournie.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecipeDetail;