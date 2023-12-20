import { createReducer, on } from '@ngrx/store';
import * as appActions from '../app.actions'
import { initialState } from '../app.reducer';

export const suggestionReducer = createReducer(
  initialState,
  on(appActions.loadSuggestionsSuccess, (state, { suggestions }) => ({ ...state, suggestions })),
  on(appActions.loadSuggestionsFailure, () => initialState) 
);