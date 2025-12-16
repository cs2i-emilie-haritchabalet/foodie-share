// eslint-disable-next-line no-unused-vars
import { useState, useEffect } from 'preact/hooks';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/recipe-details.css';
import { FaHeart, FaAngleDoubleLeft, FaTrashAlt, FaPenNib, FaRegComment } from 'react-icons/fa';

const RecipeDetail = () => {

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
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const location = useLocation();
    const [comment, setComment] = useState('');
    const [username, setUsername] = useState('');
    const intervalDuration = 3000;
    const [activeIndex, setActiveIndex] = useState(0);


   useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get<Recipe>(`http://localhost:5000/foodie-share/${id}`);
                setRecipe(response.data);
            } catch (error) {
                setError('Erreur lors de la récupération de la recette.');
                console.error('Erreur lors de l\'affichage de la recette:', error);
            }
        };

        fetchRecipe();
    }, [id]);


    useEffect(() => {
        // Vérifie si un message de succès est présent
        if (location.state?.successMessage) {
            setShowSuccessMessage(true); // Montre le message

            // Configure setTimeout pour masquer le message après 3 secondes
            const timer = setTimeout(() => {
                setShowSuccessMessage(false); 
            }, 3000);

            // Nettoyage du timer
            return () => clearTimeout(timer);
        }
    }, [location.state]);

    useEffect(() => {
        if (recipe && recipe.comments && recipe.comments.length > 0) {
            const interval = setInterval(() => {
                setActiveIndex((prevIndex) => (prevIndex + 1) % recipe.comments.length);
            }, intervalDuration);
            return () => clearInterval(interval); 
        }
    }, [recipe, intervalDuration]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!recipe) {
        return <p>Chargement...</p>;
    }

    const goBack = () => {
        navigate(-1); // Renvoie à la page précédente
    };

    const handleLike = async () => {
       
        try {
            const response = await axios.post(`http://localhost:5000/foodie-share/${id}/like`);
            setRecipe((prevRecipe) => ({
                ...prevRecipe,
                likes: response.data.likes,
            }));
        } catch (error) {
            if (error.response && error.response.status === 403) {
                alert("Vous avez déjà aimé cette recette.");
            } else {
                console.error("Erreur lors de l'ajout d'un like:", error);
            }
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:5000/foodie-share/${id}/comment`, {
                user: username,
                message: comment,
            });
            setRecipe((prevRecipe) => ({
                ...prevRecipe,
                comments: response.data.comments,
            }));
            setComment('');
            setUsername('');
        } catch (error) {
            console.error('Erreur lors de l\'ajout d\'un commentaire:', error);
        }
    };


    return (
        <div id="divDetails">
            <button id="goBack" onClick={goBack}><FaAngleDoubleLeft /> Retour</button>

            <div id="titleDetails">
                {showSuccessMessage && (
                    <p className="success">{location.state.successMessage}</p>
                )}

                <h1>{recipe.title}  </h1>
                <div className='likes'>
                    <span>
                        {recipe.likes} <FaHeart style={{ color: 'red' }} />
                    </span>
                    <button id="addLike" onClick={handleLike}> J&apos;aime</button>
                </div>

            </div>

            <img
                id="imgDetails"
                src={recipe.imagePath ? `http://localhost:5000${recipe.imagePath}` : `http://localhost:5000/images/recipes/livre_recette.png`}
                alt={recipe.title}
            />
            <div className="actions">
                    <Link to={`/foodie-share/${recipe._id}/delete`}><FaTrashAlt /> Supprimer la recette</Link>
                    <Link to={`/foodie-share/${recipe._id}/update`}><FaPenNib /> Modifier la recette</Link>
                </div>
            <div className="bodyDetails">
                <h3>Catégorie: {recipe.tag}</h3>
                <p>{recipe.description}</p>

                <div className='recipe'>
                    <h2>Ingrédients</h2>
                    <ul>
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                    <h2>Étapes</h2>
                    <ol>
                        {recipe.steps.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>

                </div>

                <div className="comments-section">
                <h3>Ajouter un commentaire</h3>
                    <form onSubmit={handleCommentSubmit}>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Votre nom"
                            required
                        />
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Votre commentaire"
                            required
                        ></textarea>
                        <button type="submit">Commenter</button>
                    </form>

                    <h3>{recipe.comments.length} Avis:</h3>
                    <div className='wrapper'>
                        <div className='carousel'>
                            {recipe.comments.map((comment, index) => (
                                <div
                                    className={`carousel__item ${index === activeIndex ? 'active' : ''}`}
                                    key={index}
                                >
                                    <div className='carousel__item-head'>
                                        <FaRegComment />
                                    </div>
                                    <div className='carousel__item-body'>
                                        <p className='title'>{comment.user}</p>
                                        <p>{comment.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;
