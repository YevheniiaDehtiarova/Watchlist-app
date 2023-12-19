import { createAction, props } from "@ngrx/store";
import { Title } from "../types/title";
import { SearchDetail } from "../types/search-detail";
import { SearchResult } from "../types/search-result";


export const fetchCurrentTitle = createAction('[App] Fetch Current Title', props<{ id: string }>());
export const fetchCurrentTitleSuccess = createAction('[App] Fetch Current Title Success', props<{ currentTitle: Title }>());

export const searchByTitle = createAction('[App] Search By Title', props<{ title: string }>());
export const searchSuccess = createAction('[App] Search Success',props<{ movies: SearchResult }>());
export const searchFailure = createAction( '[App] Search Failure', props<{ error: any }>());

export const loadSuggestions = createAction('[Search] Load Suggestions',props<{ searchTerm: string }>());
export const loadSuggestionsSuccess = createAction('[Search] Load Suggestions Success',props<{ suggestions: string[] }>());
export const loadSuggestionsFailure = createAction( '[Search] Load Suggestions Failure', props<{ error: any }>());

export const loadWatchList = createAction('[App] Load Watch List' )
export const addToWatchList = createAction('[App] Add To Watch List', props<{ movie: SearchDetail}>());
export const removeFromWatchList = createAction('[App] Remove From Watch List', props<{ movie: SearchDetail}>());
export const updateMovieFromWatchList = createAction('[App] Update Movie From Watch List', props<{ movie: SearchDetail }>());
