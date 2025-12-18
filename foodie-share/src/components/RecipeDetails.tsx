//import pour ESlint
import React from 'react';
import { useState, useEffect } from 'preact/hooks';
import type { JSX } from 'preact';
import { useParams, useNavigate } from 'react-router-dom';
import '../assets/css/recipe-details.css';
import { FaHeart, FaAngleDoubleLeft, FaRegComment } from 'react-icons/fa';
import { useRecipes} from '../context/RecipesContext';
import type { Recipe } from '../context/RecipesContext';


const RecipeDetail = () => {
  const { state, dispatch } = useRecipes();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalDuration = 3000;

  const handleLike = () => {
    if (recipe) dispatch({ type: 'ADD_LIKE', payload: { id: recipe.id } });
  };

  const handleCommentSubmit = (e: JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (recipe) {
      dispatch({
        type: 'ADD_COMMENT',
        payload: { id: recipe.id, comment: { user: author, message } }
      });
      setAuthor('');
      setMessage('');
    }
  };

    // Récupération depuis le JSON statique
    useEffect(() => {
        fetch('/foodie-share/data/recipes.json')
            .then(res => res.json())
            .then((data: Recipe[]) => {
                const found = data.find(r => r.id === Number(id));
                setRecipe(found ?? null);
            })
            .catch(() => setError('Erreur lors de la récupération de la recette.'));
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

    if (!recipe) return <p>Recette non trouvée</p>;

    return (
        <div id="divDetails">
            <button id="goBack" onClick={goBack}><FaAngleDoubleLeft /> Retour</button>

            <div id="titleDetails">
                <h1>{recipe.title}</h1>
                <div className='likes'>
                    <span>{recipe.likes} <FaHeart style={{ color: 'red' }} /></span>
                    <button id="addLike" onClick={handleLike}>J&apos;aime</button>
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
                            value={author}
                            onInput={(e: JSX.TargetedEvent<HTMLInputElement>) => setAuthor(e.currentTarget.value)}
                            placeholder="Votre nom"
                        />
                        <textarea
                            value={message}
                            onInput={(e: JSX.TargetedEvent<HTMLTextAreaElement>) => setMessage(e.currentTarget.value)}
                            placeholder="Votre commentaire"
                        />
                        <button type="submit">Commenter</button>
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
