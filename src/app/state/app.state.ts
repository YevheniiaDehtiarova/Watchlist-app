import { Injectable } from "@angular/core";
import { ApiService } from "../api/services/api.service";
import { BehaviorSubject, Observable, catchError, of, tap } from "rxjs";
import { SearchDetail } from "../api/types/search-detail";

@Injectable({
  providedIn: 'root'
})
export class AppState {

  private currentTitle = new BehaviorSubject<null | any>(null);
  public watchList = new BehaviorSubject<SearchDetail[]>([]);

  public currentTitle$ = this.currentTitle.asObservable();
  public watchList$ = this.watchList.asObservable();

  constructor(private api: ApiService) {
  }

  public fetchCurrentTitle(title: string) {
    return this.api.getByTitle(title).pipe(tap(res => this.currentTitle.next(res)))
  }

  public searchByTitle(title: string) {
    return this.api.search(title);
  }
  
  public searchSuggestions(searchTerm: string){
    return this.api.getSuggestions(searchTerm)
  }


  public addToWatchList(movie: SearchDetail) {
    const currentMovies = this.watchList.value;
    const checkExistMovie = currentMovies.find(currentMovie => {
      return movie.imdbID === currentMovie.imdbID
    });
    if(!checkExistMovie){
      this.watchList.next([...currentMovies, movie]);
    }
  }

  public removeFromWatchList(movie: SearchDetail) {
    const currentMovies = this.watchList.value;
    const index = currentMovies.findIndex((currentMovie) => currentMovie.imdbID === movie.imdbID);
    if(index !== -1){
      currentMovies.splice(index, 1);
      this.watchList.next(currentMovies);
    }
  }
  public updateMovieFromWatchList(movie: SearchDetail){
    const currentMovies = this.watchList.value;
    const index = currentMovies.findIndex((currentMovie) => currentMovie.imdbID === movie.imdbID);

    if (index !== -1) {
      currentMovies[index].isWatched = true;
      this.watchList.next([...currentMovies]);
    }
  }


}
