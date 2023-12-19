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
  /* watchList: Array<SearchDetail> = [];  */
  watchList$!: Observable<Array<SearchDetail>>;


  constructor(public store: Store<AppState>,) {
    super();
  }


  ngOnInit(): void {
    this.loadWatchList();
  }

  loadWatchList(): void {
    this.watchList$ = this.store.pipe(select(selectWatchList));

  /*   this.store.watchList$.pipe(take(1), takeUntil(this.destroy$)).subscribe((list) => {
      this.watchList = list;

      if (this.watchList.length === 0) {
        this.watchList = this.getWatchListFromLocalStorage();
        this.store.watchList.next(this.watchList);
      } else {
        this.updateWatchListLocalStorage(this.watchList)
      }
    }); */
  }

  markAsWatched(movie: SearchDetail): void {
    this.store.dispatch(appActions.updateMovieFromWatchList({movie}))

  }

  removeMovieFromWatchList(movie: SearchDetail): void{
    this.store.dispatch(appActions.removeFromWatchList({ movie }));
  }



  /*public updateWatchListIndex(movie: SearchDetail): number {
    return this.watchList?.findIndex((currentMovie) => currentMovie.imdbID === movie.imdbID);
  }

  public getWatchListFromLocalStorage(): Array<SearchDetail> {
    const storedWatchList = localStorage.getItem('watchList');
    return storedWatchList ? JSON.parse(storedWatchList) : [];
  }

  public updateWatchListLocalStorage(watchList: Array<SearchDetail>): void {
    localStorage.setItem('watchList', JSON.stringify(watchList));
  }

  public removeWatchListFromLocalStorage(movie: SearchDetail, watchList: Array<SearchDetail>): void {
    console.log(movie, watchList)
    const index = watchList.findIndex((currentMovie) => currentMovie.imdbID === movie.imdbID)
    if (index !== -1) {
      watchList.splice(index, 1);
      this.updateWatchListLocalStorage(watchList);
    }
  } */
}


