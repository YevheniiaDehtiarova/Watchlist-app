import { createReducer, on } from '@ngrx/store';
import * as appActions from '../app.actions'
import { initialState } from '../app.reducer';

export const searchReducer = createReducer(
  initialState,
  on(appActions.searchByTitle, (state) => ({ ...state, loading: true })),
  on(appActions.searchSuccess, (state, { movies }) => ({ ...state,searchResults: movies,searchError: null,loading: false})),
  on(appActions.searchFailure, (state, { error }) => ({...state, searchResults: null,searchError: error, loading: false})),
  on(appActions.updateSearchMovie, (state: any, { movie }) => {
    const updatedSearchResults = (state.searchResults?.Search || []).map((item: { imdbID: string }) =>
      item.imdbID === movie.imdbID ? { ...item, isAdded: true } : item
    );
    return {
      ...state,
      searchResults: { ...state.searchResults, Search: updatedSearchResults}
    };
  }),
);