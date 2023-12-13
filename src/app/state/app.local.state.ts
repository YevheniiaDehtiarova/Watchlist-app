import { Injectable } from "@angular/core";
import { ApiService } from "../api/services/api.service";
import { BehaviorSubject, tap } from "rxjs";
import { SearchDetail } from "../api/types/search-detail";

@Injectable({
  providedIn: 'root'
})
export class AppLocalState {
    public getWatchListFromLocalStorage(): Array<SearchDetail> {
        const storedWatchList = localStorage.getItem('watchList');
        return storedWatchList ? JSON.parse(storedWatchList) : [];
      }
    
      public updateWatchListLocalStorage(watchList: Array<SearchDetail>): void {
        localStorage.setItem('watchList', JSON.stringify(watchList));
      }
    
      public removeWatchListFromLocalStorage(movie: SearchDetail, watchList: Array<SearchDetail>): void {
        const index = watchList.findIndex((currentMovie) => currentMovie.imdbID === movie.imdbID)
        if (index !== -1) {
          watchList.splice(index, 1);
          this.updateWatchListLocalStorage(watchList);
        }
    }
       

}
