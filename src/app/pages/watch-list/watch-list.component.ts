import { Component, OnInit } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { AsyncPipe, CommonModule, NgClass, NgFor } from '@angular/common';
import { SearchDetail } from '../../api/types/search-detail';
import { Observable, take, takeUntil } from 'rxjs';
import { BaseComponent } from '../base.component';
import { Store, select } from '@ngrx/store';
import { selectWatchList } from '../../api/store/app.selector';
import { AppState } from '../../api/store/app.state';
import * as appActions from '../../api/store/app.actions'


@Component({
  selector: 'app-watch-list',
  standalone: true,
  imports: [RouterLinkWithHref, NgFor, CommonModule, AsyncPipe, NgClass],
  templateUrl: './watch-list.component.html',
  styleUrl: './watch-list.component.scss',
})
export class WatchListComponent extends BaseComponent implements OnInit {
  watchList: Array<SearchDetail> = [];  
  watchList$!: Observable<Array<SearchDetail>>;


  constructor(public store: Store<AppState>,) {
    super();
  }


  ngOnInit(): void {
    this.loadWatchList();
  }

  loadWatchList(): void {
    this.store.pipe(select(selectWatchList),take(1), takeUntil(this.destroy$)).subscribe(list => {

      if(list.length) {
        this.watchList$ = this.store.pipe(select(selectWatchList));
        this.watchList = list;
        this.updateWatchListLocalStorage(list)
      } else {
        this.watchList = this.getWatchListFromLocalStorage();
        this.store.dispatch(appActions.addMoviesToWatchList({movies: this.watchList}));
        this.watchList$ = this.store.pipe(select(selectWatchList));
      }
    })
  }

  markAsWatched(movie: SearchDetail): void {
    this.store.dispatch(appActions.updateMovieFromWatchList({movie}));

    const index = this.updateWatchListIndex(movie);

    if (index !== -1 && this.watchList?.length > 0) {
      const updatedMovie = { ...this.watchList[index], isWatched: true };
      const updatedWatchList = this.getWatchListFromLocalStorage();
      updatedWatchList[index] = updatedMovie;
  
      this.updateWatchListLocalStorage(updatedWatchList);
    }

  }

  removeMovieFromWatchList(movie: SearchDetail): void{
    this.store.dispatch(appActions.removeFromWatchList({ movie }));
    this.removeWatchListFromLocalStorage(movie);

  }

  public updateWatchListIndex(movie: SearchDetail): number {
    return this.watchList?.findIndex((currentMovie) => currentMovie.imdbID === movie.imdbID);
  } 

  public getWatchListFromLocalStorage(): Array<SearchDetail> {
    const storedWatchList = localStorage.getItem('watchList');
    return storedWatchList ? JSON.parse(storedWatchList) : [];
  }

  public updateWatchListLocalStorage(watchList: Array<SearchDetail>): void {
    localStorage.setItem('watchList', JSON.stringify(watchList));
  }

  public removeWatchListFromLocalStorage(movie: SearchDetail): void {
    const watchList = this.getWatchListFromLocalStorage();
    const updatedWatchList = [...watchList];
    const index = updatedWatchList.findIndex((currentMovie) => currentMovie.imdbID === movie.imdbID);

    if (index !== -1) {
      updatedWatchList.splice(index, 1);
      this.updateWatchListLocalStorage(updatedWatchList);
    }
  } 
}


