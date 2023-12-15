import { Injectable } from "@angular/core";
import { ApiService } from "../api/services/api.service";
import { BehaviorSubject, Observable, catchError, of, tap } from "rxjs";
import { SearchDetail } from "../api/types/search-detail";
import { Title } from "@angular/platform-browser";

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
    console.log(title, 'title fetch form store')
    return this.api.getByTitle(title).pipe(tap(res => this.currentTitle.next(res)))
  }

  public searchByTitle(title: string) {
    console.log(title, 'title from search and store')
    return this.api.search(title);
  }


  public addToWatchList(movie: SearchDetail) {
    const currentMovies = this.watchList.value;
    const checkExistMovie = currentMovies.find(currentMovie => {
      return movie.imdbID === currentMovie.imdbID
    });
    if(!checkExistMovie){
      console.log(currentMovies, 'current movies from store WL');
      this.watchList.next([...currentMovies, movie]);
      console.log(this.watchList.value, 'update WL VALUE ON STORE')
    }
  }

  public removeFromWatchList(movie: SearchDetail) {
    const currentMovies = this.watchList.value;
    const index = currentMovies.findIndex((currentMovie) => currentMovie.imdbID === movie.imdbID);
    if(index !== -1){
      currentMovies.splice(index, 1);
      this.watchList.next(currentMovies);
      console.log(this.watchList.value, 'wl value in store after deleting')
    }
  }
  public updateMovieFromWatchList(movie: SearchDetail){
    const currentMovies = this.watchList.value;
    const index = currentMovies.findIndex((currentMovie) => currentMovie.imdbID === movie.imdbID);

    if (index !== -1) {
      currentMovies[index].isWatched = true;
      this.watchList.next([...currentMovies]);
      console.log(this.watchList.value, 'wl value in store after updating')
    }
  }


}
