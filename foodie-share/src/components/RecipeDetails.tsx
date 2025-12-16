// eslint-disable-next-line no-unused-vars
import { useState, useEffect } from 'preact/hooks';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/recipe-details.css';
import { FaHeart, FaAngleDoubleLeft, FaTrashAlt, FaPenNib, FaRegComment } from 'react-icons/fa';

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

const RecipeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [comment, setComment] = useState('');
    const [username, setUsername] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const intervalDuration = 3000;

    // Fetch recipe
    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get<Recipe>(`http://localhost:3001/foodie-share/${id}`);
                setRecipe(response.data);
            } catch (err) {
                setError('Erreur lors de la récupération de la recette.');
                console.error(err);
            }
        };
        fetchRecipe();
    }, [id]);

    // Success message timer
    useEffect(() => {
        if (location.state?.successMessage) {
            setShowSuccessMessage(true);
            const timer = setTimeout(() => setShowSuccessMessage(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [location.state]);

    // Carousel des commentaires
    useEffect(() => {
        if (recipe?.comments && recipe.comments.length > 0) {
            const interval = setInterval(() => {
                setActiveIndex((prevIndex) => (prevIndex + 1) % recipe.comments!.length);
            }, intervalDuration);
            return () => clearInterval(interval);
        }
    }, [recipe]);

    if (error) return <p>{error}</p>;
    if (!recipe) return <p>Chargement...</p>;

    const goBack = () => navigate(-1);

    const handleLike = async () => {
        try {
            const response = await axios.post<{ likes: number }>(`http://localhost:3001/foodie-share/${id}/like`);
            setRecipe({ ...recipe, likes: response.data.likes });
        } catch (err: any) {
            if (err.response?.status === 403) {
                alert("Vous avez déjà aimé cette recette.");
            } else {
                console.error(err);
            }
        }
    };

    const handleCommentSubmit = async (e: Event) => {
        e.preventDefault();
        if (!recipe) return;
        try {
            const response = await axios.post<{ comments: Comment[] }>(
                `http://localhost:3001/foodie-share/${id}/comment`,
                { user: username, message: comment }
            );
            setRecipe({ ...recipe, comments: response.data.comments });
            setComment('');
            setUsername('');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div id="divDetails">
            <button id="goBack" onClick={goBack}><FaAngleDoubleLeft /> Retour</button>

            <div id="titleDetails">
                {showSuccessMessage && <p className="success">{location.state.successMessage}</p>}
                <h1>{recipe.title}</h1>
                <div className='likes'>
                    <span>{recipe.likes} <FaHeart style={{ color: 'red' }} /></span>
                    <button id="addLike" onClick={handleLike}>J'aime</button>
                </div>
            </div>

            <img
                id="imgDetails"
                src={recipe.imagePath ? `http://localhost:3001${recipe.imagePath}` : `http://localhost:3001/images/recipes/livre_recette.png`}
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
                    <ul>{recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}</ul>

                    <h2>Étapes</h2>
                    <ol>{recipe.steps.map((step, i) => <li key={i}>{step}</li>)}</ol>
                </div>

                <div className="comments-section">
                    <h3>Ajouter un commentaire</h3>
                    <form onSubmit={handleCommentSubmit}>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername((e.currentTarget as HTMLInputElement).value)}
                            placeholder="Votre nom"
                            required
                        />
                        <textarea
                            value={comment}
                            onChange={(e) => setComment((e.currentTarget as HTMLTextAreaElement).value)}
                            placeholder="Votre commentaire"
                            required
                        />
                        <button type="submit">Commenter</button>
                    </form>

                    <h3>{recipe.comments?.length ?? 0} Avis:</h3>
                    <div className='wrapper'>
                        <div className='carousel'>
                            {recipe.comments?.map((c, i) => (
                                <div className={`carousel__item ${i === activeIndex ? 'active' : ''}`} key={i}>
                                    <div className='carousel__item-head'><FaRegComment /></div>
                                    <div className='carousel__item-body'>
                                        <p className='title'>{c.user}</p>
                                        <p>{c.message}</p>
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
