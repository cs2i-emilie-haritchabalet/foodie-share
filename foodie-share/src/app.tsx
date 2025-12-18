//import pour ESlint
import React from 'react';
import {HashRouter as Router, Routes, Route } from 'react-router-dom';
import { RecipesProvider } from './context/RecipesContext';
import HomePage from './components/HomePage.js';
import RecipeDetail from './components/RecipeDetails.js';
import RecipesList from './components/RecipesList.js';
import RecipeDelete from './components/RecipeDelete.js';
import RecipeEdit from './components/RecipeEdit.js';

    const App = () => (
  <RecipesProvider>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/all" element={<RecipesList />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/recipes/:id/delete" element={<RecipeDelete />} /> 
        <Route path="/recipes/:id/update" element={<RecipeEdit />} />
      </Routes>
    </Router>
  </RecipesProvider>
);

export default App;

