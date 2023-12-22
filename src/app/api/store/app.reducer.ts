import { Action, State, createReducer, on } from '@ngrx/store';
import * as appActions from './app.actions';
import { AppState } from './app.state';


export const initialState: AppState = {
  currentTitle: null,
  watchList: [],
  searchResults: null,
  searchError: null,
  suggestions: [],
  loading: false,
};




export const appReducer = createReducer(
  initialState,
  on(appActions.setMoviesFromLocalStorage, (state, { movies }) =>{ return  ({ ...state, watchList: movies })}),
  on(appActions.fetchCurrentTitle, (state) => ({ ...state, loading: true })),
  on(appActions.fetchCurrentTitleSuccess, (state, { currentTitle }) => {
    const isCheckAddedToList = state.searchResults?.Search.find(movie => movie.imdbID === currentTitle.imdbID)?.isAdded;
    const isCheckAddedToWatchList = state.watchList.find(movie => movie.imdbID === currentTitle.imdbID)?.isAdded;
    if (isCheckAddedToList || isCheckAddedToWatchList) {
      const updatedCurrentTitle = { ...currentTitle, isAdded: true };
      return { ...state, currentTitle: updatedCurrentTitle, loading: false };
    }
    return { ...state, currentTitle, loading: false };
  }),
  on(appActions.fetchCurrentTitleFailure, (state) => ({ ...state, loading: false })),
  on(appActions.updateCurrentTitle, (state, {currentTitle, isAdded}) =>{const updateCurrentTitle = {...currentTitle, isAdded: isAdded};return {...state, currentTitle: updateCurrentTitle}}), 


  on(appActions.addToWatchList, (state, { movie }) => {
     const isMovieExist = state.watchList.some(existingMovie => existingMovie.imdbID === movie.imdbID);
    if (!isMovieExist) {const updatedWatchList = [...state.watchList, movie];
      localStorage.setItem('watchList', JSON.stringify(updatedWatchList));
      return { ...state, watchList: [...state.watchList, movie]}; 
  } return state;}),
  on(appActions.addMoviesToWatchList, (state, { movies }) => { return { ...state, watchList: movies};}), 
  on(appActions.removeFromWatchList, (state, { movie }) => {
    const updatedWatchList = state.watchList.filter(item => item.imdbID !== movie.imdbID);
    localStorage.setItem('watchList', JSON.stringify(updatedWatchList));
    return { ...state, watchList: updatedWatchList };
  }), 

  on(appActions.updateMovieFromWatchList, (state, { movie }) => {const updatedWatchList = state.watchList.map((item) =>
        item.imdbID === movie.imdbID ? { ...item, isWatched: true } : item);
      localStorage.setItem('watchList', JSON.stringify(updatedWatchList));
      return { ...state, watchList: updatedWatchList };
  }),


  on(appActions.searchByTitle, (state) => ({ ...state, loading: true })),
  on(appActions.searchSuccess, (state, { movies }) => ({ ...state,searchResults: movies,searchError: null,loading: false})),
  on(appActions.searchFailure, (state, { error }) => ({...state, searchResults: null,searchError: error, loading: false})),
  on(appActions.updateSearchMovie, (state: any, { movie }) => {
  const updatedSearchResults = (state.searchResults?.Search || []).map((item: { imdbID: string }) =>item.imdbID === movie.imdbID ? { ...item, isAdded: true } : item);
    return { ...state, searchResults: { ...state.searchResults, Search: updatedSearchResults}}}),


  on(appActions.loadSuggestionsSuccess, (state, { suggestions }) => ({ ...state, suggestions })),
  on(appActions.loadSuggestionsFailure, () => initialState) 
);


