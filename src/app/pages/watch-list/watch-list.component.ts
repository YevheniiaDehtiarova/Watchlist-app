import { Component,  OnInit, SimpleChanges } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { AsyncPipe, CommonModule, NgClass, NgFor } from '@angular/common';
import { SearchDetail } from '../../api/types/search-detail';
import { AppState } from '../../state/app.state';
import {  take, takeUntil } from 'rxjs';
import { BaseComponent } from '../base.component';
import { AppLocalState } from '../../state/app.local.state';


@Component({
  selector: 'app-watch-list',
  standalone: true,
  imports: [RouterLinkWithHref, NgFor, CommonModule, AsyncPipe, NgClass],
  templateUrl: './watch-list.component.html',
  styleUrl: './watch-list.component.scss',
})
export class WatchListComponent extends BaseComponent implements OnInit {
  watchList: Array<SearchDetail> = [];

  constructor(public store: AppState, public localState: AppLocalState) {
    super();
  }


  ngOnInit(): void {
    this.loadWatchList();
  }

  loadWatchList(): void {
    this.store.watchList$.pipe(take(1),takeUntil(this.destroy$)).subscribe((list) => {
      this.watchList = list;
      console.log(this.watchList, 'array from store')
  
      if (this.watchList.length === 0) {
        this.watchList = this.localState.getWatchListFromLocalStorage();
        this.store.watchList.next(this.watchList)
        console.log(this.watchList, 'arrayLocal from local storage');
      } else {
        this.localState.updateWatchListLocalStorage(this.watchList)
      }
    });
  }

  markAsWatched(movie: SearchDetail): void {
    console.log(movie, 'movie from mark watched');
    this.store.updateMovieFromWatchList(movie);

    const index = this.updateWatchListIndex(movie);

    if (index !== -1 && this.watchList?.length > 0) {
      this.watchList[index].isWatched = true;
      console.log(this.watchList, 'watch list after mark');
      this.localState.updateWatchListLocalStorage(this.watchList);
    }
  }

  removeMovieFromWatchList(movie: SearchDetail): void {
    console.log(movie, 'movie from mark deleted');
    this.store.removeFromWatchList(movie);
    this.localState.removeWatchListFromLocalStorage(movie, this.watchList);
  }

  public updateWatchListIndex(movie: SearchDetail): number {
    return this.watchList?.findIndex((currentMovie) => currentMovie.imdbID === movie.imdbID);
  }

}



