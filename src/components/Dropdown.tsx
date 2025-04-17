/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";

const Dropdown = () => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [recipes, setRecipes] = useState<any[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState("");
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [recipeDetails, setRecipeDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleServiceWorkerMessage = (event: MessageEvent, recipeId = "") => {
    const { type, data, error } = event.data;
    if (error) {
      setError(error);
    } else if (type === "RECIPES_LIST") {
      setRecipes(data.recipes);
    } else if (type === "RECIPE_DETAILS" && data.id === recipeId) {
      setRecipeDetails(data);
    }
  };

  const fetchRecipesFromNetwork = async () => {
    try {
      const response = await fetch("https://dummyjson.com/recipes?select=name");
      const data = await response.json();
      setRecipes(data.recipes);
    } catch (error) {
      console.error("Network fetch error:", error);
      setError("Failed to fetch recipes from network.");
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const fetchRecipesFromServiceWorker = () => {
      const handleMessage = (event: MessageEvent) =>
        handleServiceWorkerMessage(event);
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.addEventListener("message", handleMessage);

        // Wait for the service worker to be ready before sending a message
        navigator.serviceWorker.ready.then(() => {
          navigator.serviceWorker.controller?.postMessage({
            type: "FETCH_RECIPES_LIST",
          });
        });
      } else {
        console.error("Service worker not supported");
        setError("Service worker not supported");
        fetchRecipesFromNetwork(); // Fallback if no service worker support
      }

      // Cleanup
      return () => {
        navigator.serviceWorker.removeEventListener("message", handleMessage);
      };
    };
    fetchRecipesFromServiceWorker();
  }, []);

  const handleRecipeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const recipeId = e.target.value;
    setSelectedRecipe(recipeId);
    setError(null);
    const handleMessage = (event: MessageEvent) =>
      handleServiceWorkerMessage(event, recipeId);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then(() => {
        navigator.serviceWorker.controller?.postMessage({
          type: "FETCH_RECIPE_DETAILS",
          recipeId,
        });
      });

      navigator.serviceWorker.addEventListener("message", handleMessage);
    }
    // Cleanup
    return () => {
      navigator.serviceWorker.removeEventListener("message", handleMessage);
    };
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Recipe Selector</h1>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <select onChange={handleRecipeChange} value={selectedRecipe}>
          <option value="" disabled>
            Select a recipe
          </option>
          {recipes.map((recipe) => (
            <option key={recipe.id} value={recipe.id}>
              {recipe.name}
            </option>
          ))}
        </select>
      </div>

      {recipeDetails && (
        <div className="recipe-card">
          <div className="first-block">
            <div>
              <img src={recipeDetails.image} alt={recipeDetails.name} />
              <h2>{recipeDetails.name}</h2>
            </div>
            <div>
              <p>
                <strong>Cuisine:</strong> {recipeDetails.cuisine}
              </p>
              <p>
                <strong>Cooking Time in minutes:</strong>{" "}
                {recipeDetails.cookTimeMinutes}
              </p>
              <p>
                <strong>Prep time in minutes:</strong>{" "}
                {recipeDetails.prepTimeMinutes}
              </p>
              <p>
                <strong>Servings:</strong> {recipeDetails.servings}
              </p>
              <p>
                <strong>Calories per serving:</strong>{" "}
                {recipeDetails.caloriesPerServing}
              </p>
              <p>
                <strong>Difficulty:</strong> {recipeDetails.difficulty}
              </p>
            </div>
          </div>
          <p>
            <strong>Ingredients:</strong>
          </p>
          <ul>
            {recipeDetails.ingredients.map((ingredient: string) => (
              <li key={ingredient}>{ingredient}</li>
            ))}
          </ul>
          <p>
            <strong>Instructions:</strong>
          </p>
          <ul>
            {recipeDetails.instructions.map((instruction: string) => (
              <li key={instruction}>{instruction}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
