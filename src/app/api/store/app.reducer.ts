import { createReducer, on } from '@ngrx/store';
import * as appActions from './app.actions';
import { AppState } from './app.state';

 export const initialState: AppState = {
  currentTitle: null,
  watchList: [],
  searchResults: null,
  searchError: null,
  suggestions: [],
};



export const appReducer = createReducer(
  initialState,
  on(appActions.fetchCurrentTitleSuccess, (state, { currentTitle }) => {
    console.log(currentTitle, 'currentTitle in reducer');
    return { ...state, currentTitle };
  }),
  on(appActions.addToWatchList, (state, { movie }) => ({ ...state, watchList: [...state.watchList, movie] })),
  on(appActions.removeFromWatchList, (state, { movie }) => ({
    ...state,
    watchList: state.watchList.filter((item) => item.imdbID !== movie.imdbID),
  })),
  on(appActions.updateMovieFromWatchList, (state, { movie }) => ({
    ...state,
    watchList: state.watchList.map((item) => (item.imdbID === movie.imdbID ? { ...item, isWatched: true } : item)),
  })),
  on(appActions.searchSuccess, (state, { movies }) => ({
    ...state,
    searchResults: movies,
    searchError: null,
  })),
  on(appActions.searchFailure, (state, { error }) => ({
    ...state,
    searchResults: null,
    searchError: error,
  })),
  on(appActions.loadSuggestionsSuccess, (state, { suggestions }) =>({...state, suggestions})),
  on(appActions.loadSuggestionsFailure, () => initialState)
);


