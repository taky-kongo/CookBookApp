import axios from 'axios';

// L'URL de base de l'API, lue depuis les variables d'environnement de Vite
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Définition du type pour une recette, pour la sécurité de typage avec TypeScript
export interface Recipe {
  id: number;
  title: string;
  description: string | null;
  prep_time: number | null;
  ingredients: string[];
  instructions: string;
  // Ajoutez d'autres champs si nécessaire
}

export type RecipeUpdatePayload = Partial<Omit<Recipe, 'id'>>;

const apiClient = axios.create({
  baseURL: API_URL,
});

const recipeService = {
  /**
   * Récupère toutes les recettes
   */
  getAllRecipes: async (): Promise<Recipe[]> => {
    const response = await apiClient.get('/recipes/');
    return response.data;
  },

   /**
   * Supprime une recette par son ID
   */
  deleteRecipe: async (id: number): Promise<void> => {
    await apiClient.delete(`/recipes/${id}`);
  },

  /**
   * Crée une nouvelle recette
   */
  createRecipe: async (recipeData: Omit<Recipe, 'id'>): Promise<Recipe> => {
    const response = await apiClient.post('/recipes/', recipeData);
    return response.data;
  },

  /**
   * Récupère une recette par son ID
   */
  getRecipeById: async (id: number): Promise<Recipe> => {
    const response = await apiClient.get(`/recipes/${id}`);
    return response.data;
  },

  /**
   * Met à jour une recette
   */
  updateRecipe: async (id: number, recipeData: RecipeUpdatePayload): Promise<Recipe> => {
    const response = await apiClient.patch(`/recipes/${id}`, recipeData);
    return response.data;
  },
};

export default recipeService;