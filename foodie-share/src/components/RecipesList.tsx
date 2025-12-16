// eslint-disable-next-line no-unused-vars
import { useState, useEffect } from 'preact/hooks';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/recipes-cards.css';
import { FaHeart, FaAngleDoubleLeft, FaHandPointer } from 'react-icons/fa';
import RecipeForm from './RecipeForm';

const RecipesList = () => {

    type Comment = {
        user: string;
        message: string;
    };

    type Recipe = {
        _id?: string;            
        title: string;
        description: string;
        tag: string;
        ingredients: string[];
        steps: string[];
        likes: number;
        imagePath?: string;
        comments?: Comment[];
    };


    const { id } = useParams();
    
const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedTag, setSelectedTag] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const tags = ['entrée', 'plat', 'dessert'];

    const fetchRecipes = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/foodie-share/all`);
            setRecipes(response.data);
        } catch (error) {
            setError('Erreur lors de la récupération des recettes.');
            console.error('Erreur lors de la récupération des recettes:', error);
        }
    };

    useEffect(() => {
        fetchRecipes(); // Appel initial pour charger les recettes
    }, [id]);

    useEffect(() => {
        // Vérifie si un message de succès est présent
        if (location.state?.successMessage) {
            setShowSuccessMessage(true);

            // setTimeout pour masquer le message après 3 secondes
            const timer = setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [location.state]);

    // Fonction pour gérer l'ajout de recette
    const handleRecipeAdded = () => {
        fetchRecipes();
    };

    if (error) {
        return <p>{error}</p>;
    }

    if (!recipes) {
        return <p>Chargement...</p>;
    }

    // Filtrer les recettes en fonction du tag sélectionné
    const filteredRecipes = selectedTag
        ? recipes.filter(recipe => recipe.tag === selectedTag)
        : recipes;

    return (
        <div>
            <Link to="/" id="goBack"><FaAngleDoubleLeft />Retour</Link>
            <h1>Toutes nos recettes</h1>

            <label htmlFor="tagFilter">Filtrer par catégorie : </label>

            <select
            id="tagFilter"
            value={selectedTag}
            onChange={(e) => setSelectedTag((e.currentTarget as HTMLSelectElement).value)}
            >
                <option value="">Tous</option>
                {tags.map((tag) => (
                    <option key={tag} value={tag}>{tag}</option>
                ))}
            </select>


            {showSuccessMessage && (
                <p className="success">{location.state.successMessage}</p>
            )}
            {error && <p className="error">{error}</p>}
            <div className='card-container'>
                {filteredRecipes.map((recipe) => (
                    <div key={recipe._id} className="card" onClick={() => navigate(`/foodie-share/${recipe._id}`)}>
                        <img
                            src={recipe.imagePath ? `http://localhost:5000${recipe.imagePath}` : `http://localhost:5000/images/recipes/livre_recette.png`}
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
