import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title } from '../../api/types/title';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { TypeMapper } from '../../api/types/type.mapper';
import { BaseComponent } from '../base.component';
import { takeUntil } from 'rxjs';
import { LoaderComponent } from '../loader/loader.component';
import { LoaderService } from '../../api/services/loader.service';
import { SearchDetail } from '../../api/types/search-detail';
import { AppState } from '../../api/state/app.state';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, NgClass, LoaderComponent],
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss'
})
export class TitleComponent extends BaseComponent implements OnInit {
  movieId!: string;
  title!: Title;
  stars: Array<Number> = [1, 2, 3, 4, 5];
  loading: boolean = false;
  isExistMovieWatchList: boolean = false;

  constructor(public activateRoute: ActivatedRoute,
    public store: AppState,
    private typeMapper: TypeMapper,
    private loaderService: LoaderService) {
    super();
  }

  ngOnInit(): void {
    this.calculateMovieId();
    this.loadMovieTitle();
  }

  public calculateMovieId(): string | null {
    this.movieId = this.activateRoute?.snapshot?.paramMap.get('id') as string;

    if (!this.movieId) {
      return null;
    }
    return this.movieId;
  }

  loadMovieTitle(): void {
    this.loaderService.setLoading(true);
    this.loading = true;

    this.store.fetchCurrentTitle(this.movieId).
      pipe(takeUntil(this.destroy$))
      .subscribe(title => {
        if (title?.Error && title) {
          console.log('sould add handle error')
        } else {
          this.title = title as Title;
          this.checkExistMovieWatchList(title as Title);
        }
        this.loaderService.setLoading(false);
        this.loading = false;
      })
  }


  addMovieToWatchList(currentMovie: Title): void {
    currentMovie.isAdded = true;
    const modifiedMovie = this.typeMapper.mapTitleToWatchList(currentMovie);
    this.store.addToWatchList(modifiedMovie);
  }

  removeMovieFromWatchList(currentMovie: Title): void {
    currentMovie.isAdded = false;
    const modifiedMovie = this.typeMapper.mapTitleToWatchList(currentMovie);
    this.store.removeFromWatchList(modifiedMovie);
    this.isExistMovieWatchList = false;
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
