// eslint-disable-next-line no-unused-vars
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
        <Route path="/" element={<HomePage />} />
        <Route path="/foodie-share/:id" element={<RecipeDetail />} />
        <Route path="/foodie-share/all" element={<RecipesList />} />
        <Route path="/foodie-share/:id/delete" element={<RecipeDelete />} /> 
        <Route path="/foodie-share/:id/update" element={<RecipeEdit />} />

      </Routes>
    </Router>
  );
};

export default App;
