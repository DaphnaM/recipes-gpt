import React from "react";
import { useState } from "react";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Loading from "./Loading";
import Recipe from "./Recipe";
import ReactMarkdown from "react-markdown";

export default function RecipeApp() {
  const [input, setInput] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);

  const testData = {
    name: "Bacon and Onion Cauliflower Stir Fry",
    ingredients:
      "- 6 slices bacon, diced\n- 1 onion, chopped\n- 1 head cauliflower, chopped\n- Salt and pepper, to taste",
    instructions:
      "1. In a large pan, cook diced bacon until crispy. Remove bacon from pan and set aside.\n2. In the same pan, sauté chopped onion until translucent.\n3. Add chopped cauliflower and continue to cook until tender but not mushy.\n4. Add cooked bacon back into the pan and stir to combine.\n5. Season with salt and pepper to taste.\n6. Serve hot.",
    servings: "4",
    preptime: "10 minutes",
    cooktime: "20 minutes",
  };
  const text = `Name: Bacon and Onion Cauliflower Stir Fry#

  ##Ingredients##
  
  - 6 slices bacon, diced
  - 1 onion, chopped
  - 1 head cauliflower, chopped
  - Salt and pepper, to taste
  
  ##Instructions##
  
  1. In a large pan, cook diced bacon until crispy. Remove bacon from pan and set aside.
  2. In the same pan, sauté chopped onion until translucent.
  3. Add chopped cauliflower and continue to cook until tender but not mushy.
  4. Add cooked bacon back into the pan and stir to combine.
  5. Season with salt and pepper to taste.
  6. Serve hot.
  
  #Servings# 4
  
  #Prep Time# 10 minutes
  
  #Cook Time# 20 minutes`;

  function handleChange(e) {
    setInput(e.target.value);
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  function handleSubmit() {
    console.log(input);
    const newIngredientsList = [...ingredients, input];
    setIngredients(newIngredientsList);
    setInput("");
  }

  function handleClick() {
    console.log("Generating recipe with", ingredients);
    setLoading(true);
    const params = new URLSearchParams();
    ingredients.forEach((ingredient) =>
      params.append("ingredients", ingredient)
    );
    const url = `http://localhost:3001/getRecipe?${params.toString()}`;

    const recipeInstructions = fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setRecipe(data.toString());
        setLoading(false);
        return data;
      })
      .catch((error) => console.error(error));
    console.log(recipeInstructions);
  }

  function assignParagraphsToObject(text) {
    let name = text.split(`Name:`)[1]?.trim() ?? "";
    name = name.split("Ingredients:")[0].trim();

    const ingredients = (text.split(`Ingredients:`)[1]?.trim() ?? "")
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item !== "");
    const instructions = (text.split(`Instructions:`)[1]?.trim() ?? "")
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item !== "");
    const servings =
      (text.split(`Servings:`)[1]?.trim() ?? "").split("\n")[0]?.trim() ?? "";
    const prepTime =
      (text.split(`Prep Time:`)[1]?.trim() ?? "").split("\n")[0]?.trim() ?? "";
    const cookTime =
      (text.split(`Cook Time:`)[1]?.trim() ?? "").split("\n")[0]?.trim() ?? "";

    const recipeObj = {
      name: name,
      ingredients: ingredients,
      instructions: instructions,
      servings: servings,
      prepTime: prepTime,
      cookTime: cookTime,
    };

    return recipeObj;
  }

  const text1 = `Name: Bacon and Onion Cauliflower Stir Fry\nIngredients:\n- 6 slices bacon, diced\n- 1 onion, chopped\n- 1 head cauliflower, chopped\n- Salt and pepper, to taste\n\nInstructions:\n1. In a large pan, cook diced bacon until crispy. Remove bacon from pan and set aside.\n2. In the same pan, sauté chopped onion until translucent.\n3. Add chopped cauliflower and continue to cook until tender but not mushy.\n4. Add cooked bacon back into the pan and stir to combine.\n5. Season with salt and pepper to taste.\n6. Serve hot.\n\nServings: 4\n\nPrep Time: 10 minutes\n\nCook Time: 20 minutes`;

  const objectRecipe = assignParagraphsToObject(text1);
  console.log(objectRecipe);

  // const recipeObj = assignParagraphsToObject(text);
  // console.log(recipeObj);

  // const recipeObj = recipe ? assignParagraphsToObject(recipe) : false;

  // console.log(recipeObj);

  return (
    <div className="App">
      <h3 className="title">Write ingredients to generate recipe</h3>
      <div className="input-section">
        <TextField
          id="ingredients-input"
          className="input-field"
          type="text"
          label="Ingredients"
          variant="outlined"
          placeholder="Write ingredient"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <div className="tags-section">
          {ingredients.map((ingredient) => (
            <div className="tag">{ingredient}</div>
          ))}
        </div>
      </div>
      <Button variant="outlined" onClick={handleClick}>
        Generate recipe
      </Button>
      <div className="recipe-container">
        {" "}
        {loading && !recipe && <Loading />}
        {recipe && recipe}
      </div>
    </div>
  );
}
