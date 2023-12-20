import { createReducer, on } from '@ngrx/store';
import * as appActions from '../app.actions'
import { initialState } from '../app.reducer';

export const currentTitleReducer = createReducer(
  initialState,
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
  on(appActions.updateCurrentTitle, (state, {currentTitle, isAdded}) =>{
    const updateCurrentTitle = {...currentTitle, isAdded: isAdded};
    return {...state, currentTitle: updateCurrentTitle}
  }), 
);