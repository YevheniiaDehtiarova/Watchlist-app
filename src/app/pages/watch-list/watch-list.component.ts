import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router, RouterLinkWithHref } from '@angular/router';
import { AsyncPipe, CommonModule, NgClass, NgFor } from '@angular/common';
import { SearchDetail } from '../../api/types/search-detail';
import { AppState } from '../../app.state';
import { filter, pipe, take, takeUntil } from 'rxjs';
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

  constructor(public store: AppState, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.loadWatchList();
  }

  loadWatchList(): void{
    this.store.watchList$.
    pipe(takeUntil(this.destroy$)).subscribe((list) => {
      console.log(list, 'list after subscribe');
      this.watchList = list;
      console.log(this.watchList, 'array from store')

      if (this.watchList.length === 0) {
        this.watchList = this.getWatchListFromLocalStorage();
        console.log(this.watchList, 'arrayLocal from local storage');
      } else {
        this.updateWatchListLocalStorage(this.watchList)
      }
    });
  }

  markAsWatched(movie: SearchDetail): void {
    console.log(movie, 'movie from mark watched');
    this.store.updateMovieFromWatchList(movie);

    const index = this.updateWatchListIndex(movie);

    if (index !== -1) {
      this.watchList[index].isWatched = true;
      console.log(this.watchList, 'watch list after mark');
      this.updateWatchListLocalStorage(this.watchList);
    }
  }

  removeMovieFromWatchList(movie: SearchDetail): void {
    console.log(movie, 'movie from mark deleted');
    this.store.removeFromWatchList(movie);
    this.removeWatchListFromLocalStorage(movie, this.watchList);
  }

  private updateWatchListIndex(movie: SearchDetail): number {
    return this.watchList.findIndex((currentMovie) => currentMovie.imdbID === movie.imdbID);
  }

  private getWatchListFromLocalStorage(): Array<SearchDetail> {
    const storedWatchList = localStorage.getItem('watchList');
    return storedWatchList ? JSON.parse(storedWatchList) : [];
  }

  private updateWatchListLocalStorage(watchList: Array<SearchDetail>): void {
    localStorage.setItem('watchList', JSON.stringify(watchList));
  }

  private removeWatchListFromLocalStorage(movie: SearchDetail, watchList: Array<SearchDetail>): void {
    const index = this.updateWatchListIndex(movie);
    if (index !== -1) {
      watchList.splice(index, 1);
      this.updateWatchListLocalStorage(watchList);
    }
  }
}



