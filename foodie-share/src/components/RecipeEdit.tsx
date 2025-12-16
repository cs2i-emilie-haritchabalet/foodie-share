// eslint-disable-next-line no-unused-vars
import { useState, useEffect } from 'preact/hooks';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/recipe-form.css';

const RecipeEdit = () => {
    const { id } = useParams();  // Récupère l'ID de la recette depuis l'URL
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [steps, setSteps] = useState([]);
    const [ingredientInput, setIngredientInput] = useState('');
    const [stepInput, setStepInput] = useState('');
    const [tag, setTag] = useState('');

    useEffect(() => {
        //pré-remplir form
        const fetchRecipe = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/foodie-share/${id}`);
                const { title, description, ingredients, steps, tag } = response.data;
                setTitle(title);
                setDescription(description);
                setIngredients(ingredients);
                setSteps(steps);
                setTag(tag);
            } catch (error) {
                console.error('Erreur lors de la récupération de la recette:', error);
            }
        };
        fetchRecipe();
    }, [id]);

    const handleAddIngredient = () => {
        if (ingredientInput.trim()) {
            setIngredients([...ingredients, ingredientInput.trim()]);
            setIngredientInput('');
        }
    };

    const handleRemoveIngredient = (index) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const handleAddStep = () => {
        if (stepInput.trim()) {
            setSteps([...steps, stepInput.trim()]);
            setStepInput('');
        }
    };

    const handleRemoveStep = (index) => {
        setSteps(steps.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedRecipe = { title, description, ingredients, steps, tag };
        
        try {
            await axios.put(`http://localhost:5000/foodie-share/${id}/update`, updatedRecipe);
            navigate(`/foodie-share/${id}`, { state: { successMessage: 'Recette mise à jour avec succès !' } });
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la recette:', error);
        }
    };

    return (
        <div className='formContainer'>
            <form onSubmit={handleSubmit}>
                <h2>Modifier la recette</h2>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Titre de la recette"
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description de la recette"
                />
                <label>
                    Catégorie de la recette :
                    <select value={tag} onChange={(e) => setTag(e.target.value)}>
                        <option value="entrée">Entrée</option>
                        <option value="plat">Plat</option>
                        <option value="dessert">Dessert</option>
                    </select>
                </label>
                
                <div id="addIngredient">
                    <input
                        type="text"
                        value={ingredientInput}
                        onChange={(e) => setIngredientInput(e.target.value)}
                        placeholder="Ajouter un ingrédient"
                    />
                    <button type="button" onClick={handleAddIngredient}>
                        Ajouter un ingrédient
                    </button>
                </div>
                <ul>
                    {ingredients.map((ingredient, index) => (
                        <li key={index}>
                            {ingredient}
                            <button type="button" onClick={() => handleRemoveIngredient(index)}>
                                Supprimer
                            </button>
                        </li>
                    ))}
                </ul>

                <div id="addStep">
                    <input
                        type="text"
                        value={stepInput}
                        onChange={(e) => setStepInput(e.target.value)}
                        placeholder="Ajouter une étape"
                    />
                    <button type="button" onClick={handleAddStep}>
                        Ajouter une étape
                    </button>
                </div>
                <ol>
                    {steps.map((step, index) => (
                        <li key={index}>
                            {step}
                            <button type="button" onClick={() => handleRemoveStep(index)}>
                                Supprimer
                            </button>
                        </li>
                    ))}
                </ol>
                <button type="submit">Mettre à jour la recette</button>
            </form>
        </div>
    );
};

export default RecipeEdit;
