import React from "react";
import Loading from "./Loading";

function RecipeDetails({ recipe, imageUrl }) {
  console.log(recipe);
  const renderIngredients = () => {
    if (recipe.ingredients) {
      return recipe.ingredients.map((ingredient, index) => (
        <li key={index}>{ingredient}</li>
      ));
    }
    return null;
  };

  const renderInstructions = () => {
    if (recipe.instructions) {
      return recipe.instructions.map((instruction, index) => (
        <li key={index}>{instruction}</li>
      ));
    }
    return null;
  };

  return (
    <div>
      <div className="details-container">
        <p>
          <strong>Servings:</strong> {recipe.servings}
        </p>

        <p>
          <strong>Prep Time: </strong>
          {recipe.prepTime}
        </p>
        <p>
          {" "}
          <strong>Cook Time: </strong>
          {recipe.cookTime}{" "}
        </p>
      </div>
      <div className="grid">
        <div className="right-section">
          <h1>{recipe.name}</h1>
          <h2>Ingredients:</h2>
          <ul>{renderIngredients()}</ul>
        </div>
        {imageUrl ? (
          <img className="recipe-image" src={imageUrl} alt="Recipe" />
        ) : (
          <Loading />
        )}
      </div>
      <h2>Instructions:</h2>
      <ol>{renderInstructions()}</ol>
    </div>
  );
}

export default RecipeDetails;
