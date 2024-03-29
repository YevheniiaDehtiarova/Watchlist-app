import { Component, OnInit, inject } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { AsyncPipe, CommonModule, NgClass, NgFor } from '@angular/common';
import { SearchDetail } from '../../api/types/search-detail';
import { Observable } from 'rxjs';
import { BaseComponent } from '../base.component';
import { Store, select } from '@ngrx/store';
import { selectWatchList } from '../../api/store/app.selector';
import { StoreInterface } from '../../api/store/app.state';
import * as appActions from '../../api/store/app.actions'


@Component({
  selector: 'app-watch-list',
  standalone: true,
  imports: [RouterLinkWithHref, NgFor, CommonModule, AsyncPipe, NgClass],
  templateUrl: './watch-list.component.html',
  styleUrl: './watch-list.component.scss',
})
export class WatchListComponent extends BaseComponent implements OnInit {
  store = inject(Store<StoreInterface>);
  public watchList$: Observable<Array<SearchDetail>>= this.store.pipe(select(selectWatchList));


  ngOnInit(): void {
    this.loadWatchList();
  }

  loadWatchList(): void {
    const movies = this.getWatchListFromLocalStorage();
    if (movies.length) {
      this.store.dispatch(appActions.setMoviesFromLocalStorage({ movies }));
    }
  }

  markAsWatched(movie: SearchDetail): void {
    this.store.dispatch(appActions.updateMovieFromWatchList({ movie }));
  }

  removeMovieFromWatchList(movie: SearchDetail): void {
    this.store.dispatch(appActions.removeFromWatchList({ movie }));
  }

  public getWatchListFromLocalStorage(): Array<SearchDetail> {
    const storedWatchList = localStorage.getItem('watchList');
    return storedWatchList ? JSON.parse(storedWatchList) : [];
  }

}


