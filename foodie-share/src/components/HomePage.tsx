import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaHeart, FaHandPointer } from 'react-icons/fa';
import '../assets/css/recipes-cards.css';
import RecipeForm from './RecipeForm';
import { useRecipes } from '../context/RecipesContext';
import recipesData from '../data/recipes.json';

const HomePage = () => {
  const { state, dispatch } = useRecipes();
  const navigate = useNavigate();

  // Charger les recettes JSON dans le contexte au premier rendu
  useEffect(() => {
    if (state.recipes.length === 0) {
      recipesData.forEach(recipe => dispatch({ type: 'ADD_RECIPE', payload: recipe }));
    }
  }, [dispatch, state.recipes.length]);

  // Trier et prendre les 3 recettes les plus likées
  const topRecipes = [...state.recipes]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3);

  const handleRecipeAdded = () => {
    navigate('/all');
  };

  return (
    <div>
      <h1>Recettes les mieux notées</h1>
      <div className='card-container'>
        {topRecipes.map((recipe) => (
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
