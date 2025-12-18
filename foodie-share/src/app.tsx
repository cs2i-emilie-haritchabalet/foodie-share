//import pour ESlint
import React from 'react';
import {HashRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage.js';
import RecipeDetail from './components/RecipeDetails.js';
import RecipesList from './components/RecipesList.js';
import RecipeDelete from './components/RecipeDelete.js';
import RecipeEdit from './components/RecipeEdit.js';


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Page d'accueil */}
        <Route path="/" element={<HomePage />} />
        {/* Détail d'une recette */}
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        {/* Liste de toutes les recettes */}
        <Route path="/all" element={<RecipesList />} />
        {/* Suppression / modification */}
        <Route path="/recipes/:id/delete" element={<RecipeDelete />} /> 
        <Route path="/recipes/:id/update" element={<RecipeEdit />} />
      </Routes>
    </Router>
  );
};

export default App;
