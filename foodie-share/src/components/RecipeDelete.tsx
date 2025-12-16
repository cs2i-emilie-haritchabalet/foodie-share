import { useParams, useNavigate } from 'react-router-dom';

const RecipeDelete = () => {
    const { id } = useParams(); // Récupère l'ID de la recette à supprimer
    const navigate = useNavigate();

    const handleDelete = () => {
        fetch(`http://localhost:3001/foodie-share/${id}/delete`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la suppression');
            }
            return response.json();
        })
        .then(data => {
            console.log('Recette supprimée avec succès', data);
            // Redirige vers la liste des recettes avec un message de succès si nécessaire
            navigate('/foodie-share/all', { state: { successMessage: 'Recette supprimée avec succès !' } });
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
    };

    return (
        <div>
            <h2>Êtes-vous sûr de vouloir supprimer cette recette ?</h2>
            <button onClick={handleDelete}>Confirmer la suppression</button>
        </div>
    );
};

export default RecipeDelete;
