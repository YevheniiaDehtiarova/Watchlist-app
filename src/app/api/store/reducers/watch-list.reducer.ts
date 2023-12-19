import { SearchDetail } from "../../types/search-detail";
import { AppState } from "../app.state";

export const handleAddToWatchList = (state: AppState, { movie }: {movie: SearchDetail}) => {
    const isMovieExist = state.watchList.some(existingMovie => existingMovie.imdbID === movie.imdbID);
    if (!isMovieExist) {return { ...state, watchList: [...state.watchList, movie]};}
    return state;
  };

export const handleRemoveFromWatchList =(state: AppState, { movie }: {movie: SearchDetail}) => {
   ({...state, watchList: state.watchList.filter((item) => item.imdbID !== movie.imdbID)})
}

export const handleUpdateMovieFromWatchList =(state: AppState, { movie }: {movie: SearchDetail}) => {
    ({ ...state, watchList: state.watchList.map((item) => (item.imdbID === movie.imdbID ? { ...item, isWatched: true } : item))})
 }
