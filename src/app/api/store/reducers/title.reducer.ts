import { Title } from "../../types/title";
import { AppState } from "../app.state";

export const handleFetchCurrentTitle = (state:AppState) => ({...state, loading: true})

export const handleFetchCurrentTitleSuccess = (state: AppState, { currentTitle }: { currentTitle: Title }) => {
    const isCheckAddedToList = state.searchResults?.Search.find(movie => movie.imdbID === currentTitle.imdbID)?.isAdded;
    if (isCheckAddedToList) {
      const updatedCurrentTitle = { ...currentTitle, isAdded: isCheckAddedToList };
      return { ...state, currentTitle: updatedCurrentTitle, loading: false };
    }
    return { ...state, currentTitle, loading: false };
  };
  
export const handleFetchCurrentTitleFailure = (state: AppState) => ({ ...state, loading: false });
  
export const updateCurrentTitle = (state: AppState, { currentTitle, isAdded }: { currentTitle: Title; isAdded: boolean }) => {
    const updateCurrentTitle = {...currentTitle, isAdded: isAdded};
    return {...state, currentTitle: updateCurrentTitle}
  };