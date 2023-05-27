import React, { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export default function PreferenceSelector({ handleSetSpecification }) {
  const [input, setInput] = useState("");
  const [tags, setTags] = useState([]);
  const [options] = useState([
    "vegan",
    "Only use ingredients provided",
    "Under 30 minutes",
  ]);

  const handleInputChange = (event, value) => {
    setInput(value);
  };

  const handleAddTag = () => {
    if (input.trim() !== "") {
      const newTags = [...tags, input.trim()];
      setTags(newTags);
      setInput("");
      handleSetSpecification(newTags);
    }
  };

  const handleDeleteTag = (index) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    setTags(updatedTags);
    handleSetSpecification(updatedTags);
  };

  const handleOptionSelect = (option) => {
    const newTags = [...tags, option];
    setTags(newTags);
    setInput("");
    handleSetSpecification(newTags);
  };

  return (
    <div>
      <h2 className="prefernce-title">Choose your preference (optional)</h2>
      <Autocomplete
        options={options}
        value={input}
        inputValue={input}
        onInputChange={handleInputChange}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            handleAddTag();
          }
        }}
        onChange={(event, value) => {
          if (value) {
            handleOptionSelect(value);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Preference"
            variant="outlined"
            placeholder="Preference"
          />
        )}
      />
      <div className="tags-section">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="tag"
            onClick={() => handleDeleteTag(index)}
          >
            {tag}
            <span className="delete-indicator">X</span>
          </div>
        ))}
      </div>
    </div>
  );
}
