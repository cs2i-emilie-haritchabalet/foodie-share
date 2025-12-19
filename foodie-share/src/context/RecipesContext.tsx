//import pour ESlint
import React from 'react';
import { createContext } from 'preact';
import { useReducer, useContext } from 'preact/hooks';
import type { ComponentChildren } from 'preact';

export type Comment = { user: string; message: string };
export type Recipe = {
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

export type Action =
  | { type: 'ADD_LIKE'; payload: { id: number } }
  | { type: 'ADD_COMMENT'; payload: { id: number; comment: Comment } }
  | { type: 'ADD_RECIPE'; payload: Recipe };

type State = { recipes: Recipe[] };
const initialState: State = { recipes: [] };

export function recipesReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_LIKE':
      return {
        recipes: state.recipes.map(r =>
          r.id === action.payload.id ? { ...r, likes: r.likes + 1 } : r
        )
      };
    case 'ADD_COMMENT':
      return {
        recipes: state.recipes.map(r =>
          r.id === action.payload.id
            ? { ...r, comments: [...(r.comments ?? []), action.payload.comment] }
            : r
        )
      };
    case 'ADD_RECIPE':
      return { recipes: [...state.recipes, action.payload] };
    default:
      return state;
  }
}

// Contexte
export const RecipesContext = createContext<{
  state: State;
  dispatch: (action: Action) => void;
}>({ state: initialState, dispatch: () => null });

// Provider
export const RecipesProvider = ({ children }: { children: ComponentChildren }) => {
  const [state, dispatch] = useReducer(recipesReducer, initialState);
  return (
    <RecipesContext.Provider value={{ state, dispatch }}>
      {children}
    </RecipesContext.Provider>
  );
};

// Hook pratique
export const useRecipes = () => useContext(RecipesContext);
