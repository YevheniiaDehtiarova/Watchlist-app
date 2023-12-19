import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title } from '../../api/types/title';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { TypeMapper } from '../../api/types/type.mapper';
import { BaseComponent } from '../base.component';
import { LoaderComponent } from '../loader/loader.component';
import { LoaderService } from '../../api/services/loader.service';
import { SearchDetail } from '../../api/types/search-detail';
import { AppState } from '../../api/store/app.state';
import { Store, select } from '@ngrx/store';
import * as appActions from '../../api/store/app.actions'
import { AppFeatureModule } from '../../api/store/app-feature.module';
import { Observable, takeUntil } from 'rxjs';
import { selectCurrentTitle } from '../../api/store/app.selector';



@Component({
  selector: 'app-title',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, NgClass, LoaderComponent,AppFeatureModule, AsyncPipe],
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss'
})
export class TitleComponent extends BaseComponent implements OnInit {
  movieId!: string;
  title!: Title;
  stars: Array<Number> = [1, 2, 3, 4, 5];
  loading: boolean = false;
  isExistMovieWatchList: boolean = false;
  title$!: Observable<Title>;
  isMovieAdded: boolean = false;

  constructor(public activateRoute: ActivatedRoute,
    public store: Store<AppState>,
    private typeMapper: TypeMapper,
    private loaderService: LoaderService) {
    super();
  }

  ngOnInit(): void {
    this.calculateMovieId();
    this.fetchCurrentTitle(this.movieId);

    this.title$ = this.store.pipe(select(selectCurrentTitle));
  }

  public calculateMovieId(): string | null {
    this.movieId = this.activateRoute?.snapshot?.paramMap.get('id') as string;

    if (!this.movieId) {
      return null;
    }
    return this.movieId;
  }

  fetchCurrentTitle(id: string) {
    console.log(id, 'id in fetch title ts');
    this.loaderService.setLoading(true);
    this.loading = true;
    this.store.dispatch(appActions.fetchCurrentTitle({ id }));
  }

  addMovieToWatchList(currentMovie: Title) {
    this.isMovieAdded = true;
    const movie = this.typeMapper.mapTitleToWatchList(currentMovie); 
    console.log(movie, 'movie from add to WL in title')
    this.store.dispatch(appActions.addToWatchList({ movie }));
    this.loaderService.setLoading(false);
    this.loading = false;
  }

  removeMovieFromWatchList(currentMovie: Title){
    this.isMovieAdded = false;
    const movie = this.typeMapper.mapTitleToWatchList(currentMovie);
    this.store.dispatch(appActions.removeFromWatchList({ movie }));
  }

  isStarFilled(value: string, index: number): boolean {
    const rating = parseFloat(value);
    const filledStars = Math.round(rating / 2);
    return index + 1 <= filledStars;
  }

  checkExistMovieWatchList(title: Title): void {
    const localArray = localStorage.getItem('watchList')
    const watchList = localArray ? JSON.parse(localArray) : [];
    const findedElem = watchList.find((movie: SearchDetail) => movie.imdbID === title.imdbID);
    this.isExistMovieWatchList = findedElem ? true : false;
  }

}
