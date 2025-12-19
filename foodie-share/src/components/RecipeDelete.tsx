//import pour ESlint
import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'preact/hooks';
import type { Recipe } from '../context/RecipesContext';

const RecipeDelete = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState<Recipe | null>(null);

    useEffect(() => {
        fetch('/data/recipes.json')
        .then(res => res.json())
        .then((data: Recipe[]) => {
            const found = data.find(r => r.id === Number(id));
            setRecipe(found ?? null);
        })
        .catch(err => console.error(err));
    }, [id]);

    const handleDelete = () => {
        alert("Suppression non disponible en version statique.");
    };

    if (!recipe) return <p>Recette introuvable</p>;

    return (
        <div>
            <h2>Êtes-vous sûr de vouloir supprimer cette recette ?</h2>
            <p>{recipe.title}</p>
            <button onClick={handleDelete}>Confirmer la suppression</button>
        </div>
    );
};

export default RecipeDelete;
