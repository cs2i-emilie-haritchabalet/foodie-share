// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Importer PropTypes
import '../assets/css/recipe-form.css';

function RecipeForm({ onRecipeAdded }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [ingredientInput, setIngredientInput] = useState('');
    const [stepInput, setStepInput] = useState('');
    const [steps, setSteps] = useState([]);
    const [tag, setTag] = useState('entrée');
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

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

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Prépare les données du formulaire avec FormData
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

        fetch('http://localhost:5000/foodie-share/add', {
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
                console.log('Succès:', data);
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
                <p>Partagez votre recette:</p>
                <div className='textContainer'>
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
                </div>
                <label>
                    Catégorie de la recette :
                    <select value={tag} onChange={(e) => setTag(e.target.value)}>
                        <option value="Entrée">Entrée</option>
                        <option value="Plat">Plat</option>
                        <option value="Dessert">Dessert</option>
                    </select>
                </label>

                <div>
                    <label htmlFor="image">Ajouter une image de la recette :</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>

                <div id="addIngredient">
                    <input
                        type="text"
                        value={ingredientInput}
                        onChange={(e) => setIngredientInput(e.target.value)}
                        placeholder="Ajouter un ingrédient"
                    />
                    <button className="buttonForm" type="button" onClick={handleAddIngredient}>
                        Ajouter un ingrédient
                    </button>
                </div>

                <ul>
                    {ingredients.map((ingredient, index) => (
                        <li key={index}>
                            {ingredient}
                            <button className="buttonForm" type="button" onClick={() => handleRemoveIngredient(index)}>
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
                    <button className="buttonForm" type="button" onClick={handleAddStep}>
                        Ajouter une étape
                    </button>
                </div>

                <ol>
                    {steps.map((step, index) => (
                        <li key={index}>
                            {step}
                            <button className="buttonForm" type="button" onClick={() => handleRemoveStep(index)}>
                                Supprimer
                            </button>
                        </li>
                    ))}
                </ol>

                <button type="submit">Soumettre la recette</button>
            </form>
        </div>
    );
}

// Ajout de la validation des props
RecipeForm.propTypes = {
    onRecipeAdded: PropTypes.func.isRequired, // Validation de la prop onRecipeAdded
};

export default RecipeForm;
