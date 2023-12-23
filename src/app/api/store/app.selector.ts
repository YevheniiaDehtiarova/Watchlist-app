import { createSelector, select } from '@ngrx/store';
import { AppState } from './app.state';



const selectAppState = (state: AppState) => {
  console.log(state)
  return state;
}


export const selectCurrentTitle = createSelector(
  selectAppState,
  (state: any) => {
    return state.app.currentTitle
  }
);

export const selectWatchList = createSelector(
  selectAppState,
  (state: any) => {
    return state.app?.watchList;
  }
);

export const selectSearchMovies = createSelector(
  selectAppState,
  (state: any) => {
    return state.app?.searchResults?.Search;
  }
)

export const selectSearchError = createSelector(
  selectAppState,
  (state:any) => {
    return state.app?.searchResults?.Error;
  }
);

export const selectSuggestions = createSelector(
  selectAppState,
  (state: any) => {
    return state.app?.suggestions;
  }
)

export const selectLoading = createSelector(
  selectAppState,
  (state: any) => state.app.loading
);







