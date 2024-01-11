import { createSelector, select } from '@ngrx/store';
import { AppState } from './app.state';

const selectAppState = (state: AppState) => {
  return state;
};

export const selectCurrentTitle = createSelector(
  selectAppState,
  (state: any) => state.app.currentTitle
);

export const selectWatchList = createSelector(
  selectAppState,
  (state: any) => state.app?.watchList
);

export const selectSearchMovies = createSelector(
  selectAppState,
  (state: any) =>{ 
    console.log(state, 'state in search')
    return state.app?.searchResults?.Search
  }

);

export const selectSearchError = createSelector(
  selectAppState,
  (state: any) => state.app?.searchResults?.Error
);

export const selectSuggestions = createSelector(
  selectAppState,
  (state: any) => state.app?.suggestions
);

export const selectLoading = createSelector(
  selectAppState,
  (state: any) => {
    console.log(state, 'state in select loading')
   return state.app?.loading 
  }
);
