import { createSelector } from '@ngrx/store';
import { AppState } from './app.state';


const selectAppState = (state: AppState) => {
  console.log(state)
  return state;
}

export const selectCurrentTitle = createSelector(
selectAppState,
  (state: any) =>{
    console.log(state, 'state in selectCurrentTitle'); 
    return state.app.currentTitle
  }
);

export const selectWatchList = createSelector(
  selectAppState,
  (state: any) => {
    console.log(state, 'state in selectWatchList'); 
    return state.app.watchList;
  }
);

  export const selectSearchMovies = createSelector(
    selectAppState,
    (state: any) => {
      console.log(state, 'state in selectSearchMovies'); 
      return state.app?.searchResults?.Search;
    }
)

export const selectSuggestions = createSelector(
  selectAppState,
  (state: any) => {
    console.log(state, 'state in selectSuggestions'); 
    return state.app?.suggestions;
  }
)

export const selectLoading = createSelector(
  selectAppState,
  (state:any) => state.app.loading
);







