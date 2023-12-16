import { Component, OnInit, SimpleChanges } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { AsyncPipe, CommonModule, NgClass, NgFor } from '@angular/common';
import { SearchDetail } from '../../api/types/search-detail';
import { AppState } from '../../state/app.state';
import { take, takeUntil } from 'rxjs';
import { BaseComponent } from '../base.component';


@Component({
  selector: 'app-watch-list',
  standalone: true,
  imports: [RouterLinkWithHref, NgFor, CommonModule, AsyncPipe, NgClass],
  templateUrl: './watch-list.component.html',
  styleUrl: './watch-list.component.scss',
})
export class WatchListComponent extends BaseComponent implements OnInit {
  watchList: Array<SearchDetail> = [];

  constructor(public store: AppState) {
    super();
  }


  ngOnInit(): void {
    this.loadWatchList();
  }

  loadWatchList(): void {
    this.store.watchList$.pipe(take(1),takeUntil(this.destroy$)).subscribe((list) => {
      this.watchList = list;

      if (this.watchList.length === 0) {
        this.watchList = this.getWatchListFromLocalStorage();
        this.store.watchList.next(this.watchList)
      } else {
        this.updateWatchListLocalStorage(this.watchList)
      }
    });
  }

  markAsWatched(movie: SearchDetail): void {
    this.store.updateMovieFromWatchList(movie);

    const index = this.updateWatchListIndex(movie);

    if (index !== -1 && this.watchList?.length > 0) {
      this.watchList[index].isWatched = true;
      this.updateWatchListLocalStorage(this.watchList);
    }
  }

  removeMovieFromWatchList(movie: SearchDetail): void {
    this.store.removeFromWatchList(movie);
    this.removeWatchListFromLocalStorage(movie, this.watchList);
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

  public removeWatchListFromLocalStorage(movie: SearchDetail, watchList: Array<SearchDetail>): void {
    const index = watchList.findIndex((currentMovie) => currentMovie.imdbID === movie.imdbID)
    if (index !== -1) {
      watchList.splice(index, 1);
      this.updateWatchListLocalStorage(watchList);
    }
  }
}


