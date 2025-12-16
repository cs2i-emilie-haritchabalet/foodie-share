import { useState, useEffect } from 'preact/hooks';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import '../assets/css/recipe-details.css';
import { FaHeart, FaAngleDoubleLeft, FaTrashAlt, FaPenNib, FaRegComment } from 'react-icons/fa';
import recipesData from '../../public/data/recipes.json';

type Comment = { user: string; message: string; };
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

useEffect(() => {
  const r = recipesData.find(r => r.id === parseInt(id!));
  if (r) setRecipe({ ...r, comments: r.comments ?? [] }); 
  if (location.state?.successMessage) {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  }
}, [id, location.state]);

  if (!recipe) return <p>Recette non trouvée</p>;

  const goBack = () => navigate(-1);
  const handleLike = () => alert("Like simulé !");
  const handleCommentSubmit = (e: any) => {
    e.preventDefault();
    alert("Commentaire simulé !");
  };

  return (
    <div id="divDetails">
      <button onClick={goBack}><FaAngleDoubleLeft /> Retour</button>
      {showSuccessMessage && <p className="success">{location.state.successMessage}</p>}
      <h1>{recipe.title}</h1>
      <span>{recipe.likes} <FaHeart /></span>
      <button onClick={handleLike}>J'aime</button>

      <img src={recipe.imagePath} alt={recipe.title} />

      <div className="actions">
        <Link to={`/foodie-share/${recipe.id}/delete`}><FaTrashAlt /> Supprimer</Link>
        <Link to={`/foodie-share/${recipe.id}/update`}><FaPenNib /> Modifier</Link>
      </div>

      <h3>Catégorie: {recipe.tag}</h3>
      <p>{recipe.description}</p>

      <h2>Ingrédients</h2>
      <ul>{recipe.ingredients.map((i, idx) => <li key={idx}>{i}</li>)}</ul>

      <h2>Étapes</h2>
      <ol>{recipe.steps.map((s, idx) => <li key={idx}>{s}</li>)}</ol>

      <div className="comments-section">
        <form onSubmit={handleCommentSubmit}>
          <input placeholder="Votre nom" required />
          <textarea placeholder="Votre commentaire" required />
          <button type="submit">Commenter</button>
        </form>
        <h3>{recipe.comments?.length} Avis:</h3>
        <ul>{recipe.comments?.map((c, idx) => <li key={idx}>{c.user}: {c.message}</li>)}</ul>
      </div>
    </div>
  );
};

export default RecipeDetail;
