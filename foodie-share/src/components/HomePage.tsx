//import pour ESlint
import React from 'react';
import { useState, useEffect } from 'preact/hooks';
import { useNavigate, Link } from 'react-router-dom';
import { FaHeart, FaHandPointer } from 'react-icons/fa';
import '../assets/css/recipes-cards.css';
import RecipeForm from './RecipeForm';
import type { Recipe } from '../context/RecipesContext';

const HomePage = () => {

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchRecipes = async () => {
    try {
      const response = await fetch('/data/recipes.json');
      if (!response.ok) throw new Error('Erreur lors de la récupération des recettes.');
      const data: Recipe[] = await response.json();

      // Trier par likes décroissants
      const sorted = data.sort((a, b) => b.likes - a.likes).slice(0, 3);
      setRecipes(sorted);
    } catch (err) {
      setError((err as Error).message);
      console.error('Erreur lors de la récupération des recettes:', err);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleRecipeAdded = () => {
    fetchRecipes();
    navigate('/foodie-share/all');
  };

  return (
    <div>
      <h1>Recettes les mieux notées</h1>
      {error && <p className="error">{error}</p>}
      <div className='card-container'>
        {recipes.map((recipe) => (
          <div key={recipe.id} className="card" onClick={() => navigate(`/images/recipes/${recipe.id}`)}>
            <img
              src={recipe.imagePath ? `${recipe.imagePath}` : '/images/recipes/livre_recette.png'}
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
      <div id="recipes">
        <Link to="/all">Retrouvez toutes nos recettes <span>ici</span></Link>
      </div>
      <div id="form">
        <RecipeForm onRecipeAdded={handleRecipeAdded} />
      </div>
    </div>
  );
};

export default HomePage;
