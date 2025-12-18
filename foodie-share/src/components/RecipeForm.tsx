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

  const handleSubmit = (e: Event) => {
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
        <input value={title} onInput={(e: any) => setTitle(e.target.value)} placeholder="Titre" required />
        <textarea value={description} onInput={(e: any) => setDescription(e.target.value)} placeholder="Description" required />
        <input value={ingredientInput} onInput={(e: any) => setIngredientInput(e.target.value)} placeholder="Ajouter un ingrédient" />
        <button type="button" onClick={handleAddIngredient}>Ajouter ingrédient</button>
        <ul>{ingredients.map((i, idx) => <li key={idx}>{i}</li>)}</ul>

        <input value={stepInput} onInput={(e: any) => setStepInput(e.target.value)} placeholder="Ajouter une étape" />
        <button type="button" onClick={handleAddStep}>Ajouter étape</button>
        <ol>{steps.map((s, idx) => <li key={idx}>{s}</li>)}</ol>

        <input value={imagePath} onInput={(e: any) => setImagePath(e.target.value)} placeholder="Nom fichier image (dans /images/recipes)" />
        <select value={tag} onInput={(e: any) => setTag(e.target.value)}>
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
