// import pour ESLint
import React from 'react';
import type { JSX } from 'preact';
import { useState } from 'preact/hooks';
import { useNavigate } from 'react-router-dom';
import '../assets/css/recipe-form.css';

type RecipeFormProps = {
  onRecipeAdded: () => void;
};

function RecipeForm({ onRecipeAdded }: RecipeFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingredientInput, setIngredientInput] = useState('');
  const [stepInput, setStepInput] = useState('');
  const [steps, setSteps] = useState<string[]>([]);
  const [tag, setTag] = useState('Entrée');
  const [imagePath, setImagePath] = useState('');
  const navigate = useNavigate();

  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      setIngredients([...ingredients, ingredientInput.trim()]);
      setIngredientInput('');
    }
  };

  const handleAddStep = () => {
    if (stepInput.trim()) {
      setSteps([...steps, stepInput.trim()]);
      setStepInput('');
    }
  };

  const handleSubmit = (e: JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault();

    alert(
      "Ajout simulé : sans backend, la recette n'est pas enregistrée.\n" +
      "Fonctionnel avec une API REST."
    );

    onRecipeAdded();
    navigate('/foodie-share/all', {
      state: { successMessage: 'Ajout simulé (sans backend)' }
    });
  };

  return (
    <div className='formContainer'>
      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onInput={(e: JSX.TargetedEvent<HTMLInputElement>) => setTitle(e.currentTarget.value)}
          placeholder="Titre"
          required
        />

        <textarea
          value={description}
          onInput={(e: JSX.TargetedEvent<HTMLTextAreaElement>) => setDescription(e.currentTarget.value)}
          placeholder="Description"
          required
        />

        <input
          value={ingredientInput}
          onInput={(e: JSX.TargetedEvent<HTMLInputElement>) => setIngredientInput(e.currentTarget.value)}
          placeholder="Ajouter un ingrédient"
        />
        <button type="button" onClick={handleAddIngredient}>Ajouter ingrédient</button>
        <ul>{ingredients.map((i, idx) => <li key={idx}>{i}</li>)}</ul>

        <input
          value={stepInput}
          onInput={(e: JSX.TargetedEvent<HTMLInputElement>) => setStepInput(e.currentTarget.value)}
          placeholder="Ajouter une étape"
        />
        <button type="button" onClick={handleAddStep}>Ajouter étape</button>
        <ol>{steps.map((s, idx) => <li key={idx}>{s}</li>)}</ol>

        <input
          value={imagePath}
          onInput={(e: JSX.TargetedEvent<HTMLInputElement>) => setImagePath(e.currentTarget.value)}
          placeholder="Nom fichier image (dans /images/recipes)"
        />

        <select
          value={tag}
          onInput={(e: JSX.TargetedEvent<HTMLSelectElement>) => setTag(e.currentTarget.value)}
        >
          <option>Entrée</option>
          <option>Plat</option>
          <option>Dessert</option>
        </select>

        <button type="submit">Ajouter la recette (simulation)</button>
      </form>
    </div>
  );
}

export default RecipeForm;
