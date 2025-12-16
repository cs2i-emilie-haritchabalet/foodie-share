import { useState, useEffect } from 'preact/hooks';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaHandPointer } from 'react-icons/fa';
import '../assets/css/recipes-cards.css';
import RecipeForm from './RecipeForm';

const HomePage = () => {

  type Recipe = {
    _id: string;
    title: string;
    imagePath?: string;
    likes: number;
    tag?: string;
  };

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/foodie-share/recipes/best-rated`);
      setRecipes(response.data);
    } catch (error) {
      setError('Erreur lors de la récupération des recettes.');
      console.error('Erreur lors de la récupération des recettes:', error);
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
          <div key={recipe._id} className="card" onClick={() => navigate(`/foodie-share/recipes/${recipe._id}`)}>

            <img

              src={recipe.imagePath ? `http://localhost:3001${recipe.imagePath}` : `http://localhost:3001/images/recipes/livre_recette.png`}
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
        <Link to="/foodie-share/all" >Retrouvez toutes nos recettes <span>ici</span></Link>
      </div>
      <div id="form">
        <RecipeForm onRecipeAdded={handleRecipeAdded} />
      </div>

    </div>
  );
};

export default HomePage;
