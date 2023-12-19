import { SearchDetail } from "../../types/search-detail";
import { initialState } from "../app.reducer";
import { AppState } from "../app.state";

export const handleSearchByTitle = (state: AppState) => ({ ...state, loading: true });
export const handleSearchSuccess = (state: AppState, { movies }: {movies: Array<SearchDetail>}) => ({ ...state,searchResults: movies,searchError: null,loading: false});
export const handleSearchFailure = (state: AppState, { error }: {error: string}) => ({...state, searchResults: null,searchError: error, loading: false});
export const handleUpdateSearchMovie = (state: any, { movie }: {movie: SearchDetail}) => {
  const updatedSearchResults = (state.searchResults?.Search || []).map((item: { imdbID: string }) =>
    item.imdbID === movie.imdbID ? { ...item, isAdded: true } : item
  );
  return {
    ...state,
    searchResults: { ...state.searchResults, Search: updatedSearchResults}
  };
}


export const handleLoadSuggestionsSuccess= (state: AppState, { suggestions }: {suggestions: Array<string>}) => ({ ...state, suggestions });
export const handleLoadSuggestionsFailure = () => initialState;
