import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title } from '../../api/types/title';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { TypeMapper } from '../../api/types/type.mapper';
import { LoaderComponent } from '../loader/loader.component';
import { AppState } from '../../api/store/app.state';
import { Store } from '@ngrx/store';
import * as appActions from '../../api/store/app.actions'
import { Observable } from 'rxjs';
import { selectCurrentTitle, selectLoading } from '../../api/store/app.selector';



@Component({
  selector: 'app-title',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, NgClass, LoaderComponent, AsyncPipe],
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss'
})
export class TitleComponent implements OnInit {
  movieId!: string;
  title!: Title;
  stars: Array<Number> = [1, 2, 3, 4, 5];
  loading$: Observable<boolean> = this.store.select(selectLoading);
  isExistMovieWatchList: boolean = false;
  title$: Observable<Title> = this.store.select(selectCurrentTitle);

  constructor(public activateRoute: ActivatedRoute,
    public store: Store<AppState>,
    private typeMapper: TypeMapper) { }

  ngOnInit(): void {
    this.calculateMovieId();
    this.fetchCurrentTitle(this.movieId);
  }

  public calculateMovieId(): string | null {
    this.movieId = this.activateRoute?.snapshot?.paramMap.get('id') as string;

    if (!this.movieId) {
      return null;
    }
    return this.movieId;
  }

  fetchCurrentTitle(id: string) {
    this.store.dispatch(appActions.fetchCurrentTitle({ id }));
  }

  addMovieToWatchList(currentMovie: Title) {
    const movie = this.typeMapper.mapTitleToWatchList(currentMovie);
    this.store.dispatch(appActions.addToWatchList({ movie }));
    this.store.dispatch(appActions.updateCurrentTitle({ currentTitle: currentMovie, isAdded: true }))
  }

  removeMovieFromWatchList(currentMovie: Title) {
    const movie = this.typeMapper.mapTitleToWatchList(currentMovie);
    this.store.dispatch(appActions.removeFromWatchList({ movie }));
    this.store.dispatch(appActions.updateCurrentTitle({ currentTitle: currentMovie, isAdded: false }))
  }

  isStarFilled(value: string, index: number): boolean {
    const rating = parseFloat(value);
    const filledStars = Math.round(rating / 2);
    return index + 1 <= filledStars;
  }
}
