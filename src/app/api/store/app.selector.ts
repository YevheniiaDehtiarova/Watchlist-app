import { createSelector } from '@ngrx/store';
import { StoreInterface } from './app.state';

const selectAppState = (state: StoreInterface) => {
  return state.app; 
};

export const selectCurrentTitle = createSelector(
  selectAppState,
  state => state.currentTitle
);

export const selectWatchList = createSelector(
  selectAppState,
  state => state.watchList
);

export const selectSearchMovies = createSelector(
  selectAppState,
  state => state.searchResults?.Search

);

export const selectSearchError = createSelector(
  selectAppState,
  state=> state.searchResults?.Error
);

export const selectSuggestions = createSelector(
  selectAppState,
  state => state.suggestions
);

export const selectLoading = createSelector(
  selectAppState,
  state => state.loading 
);
