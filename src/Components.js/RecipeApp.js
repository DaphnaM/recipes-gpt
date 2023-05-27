import React, { useEffect, useState } from "react";
import { getTouchRippleUtilityClass, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Loading from "./Loading";
import Recipe from "./Recipe";
import PreferenceSelector from "./PreferenceSelector";

export default function RecipeApp() {
  const text1 = `Name: apple cake \nIngredients:\n- 6 slices bacon, diced\n- 1 onion, chopped\n- 1 head cauliflower, chopped\n- Salt and pepper, to taste\n\nInstructions:\n1. In a large pan, cook diced bacon until crispy. Remove bacon from pan and set aside.\n2. In the same pan, sauté chopped onion until translucent.\n3. Add chopped cauliflower and continue to cook until tender but not mushy.\n4. Add cooked bacon back into the pan and stir to combine.\n5. Season with salt and pepper to taste.\n6. Serve hot.\n\nServings: 4\n\nPrep time: 10 minutes\n\nCook time: 20 minutes`;

  const [input, setInput] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [recipeText, setRecipeText] = useState("");
  const [recipeObj, setRecipeObj] = useState({});
  const [loading, setLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [specifications, setSpecifications] = useState("");

  useEffect(() => {
    if (recipeText) {
      const textToObj = assignParagraphsToObject(recipeText);
      console.log("recipeObj", textToObj);
      setRecipeObj(textToObj);
      if (textToObj.name) {
        console.log("fetching image with", textToObj.name);
        fetchImage(textToObj.name);
      }
    }
  }, [recipeText]);

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
  function handleSetSpecification(specifications) {
    console.log("the specifications are", specifications);
    setSpecifications(specifications);
  }

  function handleClick() {
    console.log("Generating recipe with", ingredients);
    setLoading(true);
    const params = new URLSearchParams();
    ingredients.forEach((ingredient) =>
      params.append("ingredients", ingredient)
    );
    console.log("spefications are", specifications);

    specifications &&
      params.append("specifications", specifications.join(", "));
    const url = `http://localhost:3001/getRecipe?${params.toString()}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setRecipeText(data.toString());
        console.log(recipeText);
        setLoading(false);
      })
      .catch((error) => console.error(error));
    console.log(recipeText);
  }

  function fetchImage(recipeName) {
    const url = `http://localhost:3001/getImg?image=${encodeURIComponent(
      recipeName
    )}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setImgUrl(data); // Update the state variable directly
      })
      .catch((error) => console.error(error));
  }

  function assignParagraphsToObject(text) {
    console.log("enter function");
    let name = text.split(`Name:`)[1]?.trim() ?? "";
    name = name.split("Ingredients:")[0].trim();

    let ingredients = text
      .split(`Ingredients:`)[1]
      ?.split("Instructions:")[0]
      ?.split("\n")
      .map((item) => item.trim())
      .filter((item) => item !== "")
      .map((item) => item.replace(/^- /, "")); // Remove "-" symbol before assigning to ingredients

    const instructions = text
      .split(`Instructions:`)[1]
      ?.trim()
      .split("Servings:")[0]
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item !== "")
      .map((item) => item.replace(/^\d+\.\s/, "")); // Remove numbers and "." before assigning to instructions

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

  const handleDeleteTag = (index) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients.splice(index, 1);
    setIngredients(updatedIngredients);
  };

  // const handleOptionClick = (event, value) => {
  //   setSpecifications(value);
  // };

  return (
    <div className="app">
      <div className="app-container">
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
            {ingredients.map((ingredient, index) => (
              <div
                key={index}
                className="tag"
                onClick={() => handleDeleteTag(index)}
              >
                {ingredient}
                <span className="delete-indicator">X</span>
              </div>
            ))}
          </div>
          <PreferenceSelector handleSetSpecification={handleSetSpecification} />
        </div>
        <Button variant="outlined" onClick={handleClick}>
          Generate recipe
        </Button>
        <div className="recipe-container">
          {loading && !recipeText && <Loading />}
          {recipeText && <Recipe recipe={recipeObj} imageUrl={imgUrl} />}
        </div>
      </div>
    </div>
  );
}
