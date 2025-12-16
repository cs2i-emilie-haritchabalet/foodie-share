import { useState, useEffect } from 'preact/hooks';
import { useParams, useNavigate } from 'react-router-dom';
import '../assets/css/recipe-details.css';
import { FaHeart, FaAngleDoubleLeft, FaRegComment } from 'react-icons/fa';

type Comment = {
    user: string;
    message: string;
};

type Recipe = {
    id: number;
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

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const intervalDuration = 3000;

    // Récupération depuis le JSON statique
    useEffect(() => {
        fetch('/foodie-share/data/recipes.json')
            .then(res => res.json())
            .then((data: Recipe[]) => {
                const found = data.find(r => r.id === Number(id));
                setRecipe(found ?? null);
            })
            .catch(err => setError('Erreur lors de la récupération de la recette.'));
    }, [id]);

    // Carousel des commentaires
    useEffect(() => {
        if (recipe?.comments && recipe.comments.length > 0) {
            const interval = setInterval(() => {
                setActiveIndex(prev => (prev + 1) % recipe.comments!.length);
            }, intervalDuration);
            return () => clearInterval(interval);
        }
    }, [recipe]);

    if (error) return <p>{error}</p>;
    if (!recipe) return <p>Chargement...</p>;

    const goBack = () => navigate(-1);

    // Fonctions lecture seule
    const handleLike = () => alert("Impossible d'aimer une recette en version statique.");
    const handleCommentSubmit = (e: Event) => { 
        e.preventDefault(); 
        alert("Impossible de commenter en version statique."); 
    }

    return (
        <div id="divDetails">
            <button id="goBack" onClick={goBack}><FaAngleDoubleLeft /> Retour</button>

            <div id="titleDetails">
                <h1>{recipe.title}</h1>
                <div className='likes'>
                    <span>{recipe.likes} <FaHeart style={{ color: 'red' }} /></span>
                    <button id="addLike" onClick={handleLike}>J'aime</button>
                </div>
            </div>

            <img
              src={recipe.imagePath ? `/foodie-share${recipe.imagePath}` : '/foodie-share/images/recipes/livre_recette.png'}
              alt={recipe.title}
            />

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
                    <h3>Commentaires ({recipe.comments?.length ?? 0})</h3>
                    <form onSubmit={handleCommentSubmit}>
                        <input
                            type="text"
                            placeholder="Votre nom"
                            disabled
                        />
                        <textarea
                            placeholder="Votre commentaire"
                            disabled
                        />
                        <button type="submit" disabled>Commenter</button>
                    </form>

                    {recipe.comments && recipe.comments.length > 0 ? (
                        <div className='wrapper'>
                            <div className='carousel'>
                                {recipe.comments.map((c, i) => (
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
                    ) : <p>Aucun commentaire.</p>}
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;
