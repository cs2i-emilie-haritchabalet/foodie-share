import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHeart, FaAngleDoubleLeft, FaHandPointer } from 'react-icons/fa';
import RecipeForm from './RecipeForm';
import recipesData from '../data/recipes.json';
import { useRecipes } from '../context/RecipesContext';
import '../assets/css/recipes-cards.css';

const RecipesList = () => {
  const { state, dispatch } = useRecipes();
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const tags = ['Entrée', 'Plat', 'Dessert'];

  // Initialisation : si contexte vide, charger depuis JSON et ajouter au contexte
  useEffect(() => {
    try {
      if (state.recipes.length === 0) {
        recipesData.forEach(r => dispatch({ type: 'ADD_RECIPE', payload: r }));
      }
    } catch (err) {
      setError((err as Error).message);
    }
  }, [state.recipes, dispatch]);

  useEffect(() => {
    if (location.state?.successMessage) {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => setShowSuccessMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleRecipeAdded = () => {
    navigate(0); // ou naviguer vers /all pour rafraîchir la liste
  };

  // Filtrer par tag
  const filteredRecipes = selectedTag
    ? state.recipes.filter(recipe => recipe.tag === selectedTag)
    : state.recipes;

  return (
    <div>
      <a id="goBack" onClick={() => navigate(-1)}><FaAngleDoubleLeft /> Retour</a>
      <h1>Toutes nos recettes</h1>

      <label htmlFor="tagFilter">Filtrer par catégorie : </label>
      <select
        id="tagFilter"
        value={selectedTag}
        onChange={(e) => setSelectedTag(e.currentTarget.value)}
      >
        <option value="">Tous</option>
        {tags.map(tag => (
          <option key={tag} value={tag}>{tag}</option>
        ))}
      </select>

      {showSuccessMessage && <p className="success">{location.state.successMessage}</p>}
      {error && <p className="error">{error}</p>}

      <div className="card-container">
        {filteredRecipes.map(recipe => (
          <div key={recipe.id} className="card" onClick={() => navigate(`/recipes/${recipe.id}`)}>
            <img
              src={recipe.imagePath ? import.meta.env.BASE_URL + recipe.imagePath : import.meta.env.BASE_URL + 'images/recipes/livre_recette.png'}
              alt={recipe.title}
              className="card__img"
            />
            <span className="card__footer">
              <span>{recipe.title}</span>
              <span>
                <FaHeart style={{ color: 'red', marginRight: '8px' }} />
                {recipe.likes}
              </span>
            </span>
            <span className="card__action">
              <FaHandPointer />
            </span>
          </div>
        ))}
      </div>

      <div id="form">
        <RecipeForm onRecipeAdded={handleRecipeAdded} />
      </div>
    </div>
  );
};

export default RecipesList;
