//import pour ESlint
import React from 'react';
import { useState, useEffect } from 'preact/hooks';
import { useNavigate, useLocation } from 'react-router-dom';
import '../assets/css/recipes-cards.css';
import { FaHeart, FaAngleDoubleLeft, FaHandPointer } from 'react-icons/fa';
import RecipeForm from './RecipeForm';
import recipesData from '../data/recipes.json';
import type { Recipe } from '../context/RecipesContext';

const RecipesList = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const tags = ['Entrée', 'Plat', 'Dessert'];

  // Charger le JSON local
const fetchRecipes = async () => {
  try {
    // On utilise directement le JSON importé
    const data: Recipe[] = recipesData;
    setRecipes(data);
  } catch (err) {
    setError((err as Error).message);
    console.error('Erreur lors de la récupération des recettes');
  }
};

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    if (location.state?.successMessage) {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => setShowSuccessMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleRecipeAdded = () => {
    fetchRecipes(); // pour simuler le rafraîchissement
  };

  const filteredRecipes = selectedTag
    ? recipes.filter((recipe) => recipe.tag === selectedTag)
    : recipes;

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
        {tags.map((tag) => (
          <option key={tag} value={tag}>{tag}</option>
        ))}
      </select>

      {showSuccessMessage && <p className="success">{location.state.successMessage}</p>}
      {error && <p className="error">{error}</p>}

      <div className="card-container">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="card" onClick={() => navigate(`/recipes/${recipe.id}`)}>
           <img
              src={recipe.imagePath || '/images/recipes/livre_recette.png'}
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
