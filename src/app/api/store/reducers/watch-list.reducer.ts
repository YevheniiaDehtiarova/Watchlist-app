import { createReducer, on } from '@ngrx/store';
import * as appActions from '../app.actions'
import { initialState } from '../app.reducer';

export const watchListReducer = createReducer(
  initialState,
  on(appActions.addToWatchList, (state, { movie }) => {
    const isMovieExist = state.watchList.some(existingMovie => existingMovie.imdbID === movie.imdbID);
    if (!isMovieExist) {return { ...state, watchList: [...state.watchList, movie]};}
    return state;
  }),
  on(appActions.addMoviesToWatchList, (state, { movies }) => {
    return { ...state, watchList: movies};
    
  }),
  on(appActions.removeFromWatchList, (state, { movie }) => ({ ...state, watchList: state.watchList.filter((item) => item.imdbID !== movie.imdbID) })),
  on(appActions.updateMovieFromWatchList, (state, { movie }) => ({
    ...state, watchList: state.watchList.map((item) => (item.imdbID === movie.imdbID ? { ...item, isWatched: true } : item)),
  })),
);