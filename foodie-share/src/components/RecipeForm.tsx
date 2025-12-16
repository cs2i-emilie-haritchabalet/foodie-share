// eslint-disable-next-line no-unused-vars
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
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      setIngredients([...ingredients, ingredientInput.trim()]);
      setIngredientInput('');
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleAddStep = () => {
    if (stepInput.trim()) {
      setSteps([...steps, stepInput.trim()]);
      setStepInput('');
    }
  };

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      setImage(target.files[0]);
    }
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tag', tag);
    ingredients.forEach((ingredient, index) => {
      formData.append(`ingredients[${index}]`, ingredient);
    });
    steps.forEach((step, index) => {
      formData.append(`steps[${index}]`, step);
    });
    if (image) {
      formData.append('image', image);
    }

    fetch('http://localhost:3001/foodie-share/recipes/add', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Erreur lors de l'envoi des données");
        }
        return response.json();
      })
      .then(data => {
        onRecipeAdded();
        navigate('/foodie-share/all', { state: { successMessage: 'Recette ajoutée avec succès !' } });
      })
      .catch(error => {
        console.error('Erreur:', error);
      });
  };

  return (
    <div className='formContainer'>
      <form onSubmit={handleSubmit}>
        {/* ton formulaire reste inchangé */}
      </form>
    </div>
  );
}

export default RecipeForm;
