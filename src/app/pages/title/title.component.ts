import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AppState } from '../../app.state';
import { Title } from '../../api/types/title';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { TypeMapper } from '../../api/types/type.mapper';
import { BaseComponent } from '../base.component';
import { takeUntil } from 'rxjs';
import { LoaderComponent } from '../loader/loader.component';
import { LoaderService } from '../../api/services/loader.service';
import { SearchDetail } from '../../api/types/search-detail';

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
  typeMapper = new TypeMapper();
  stars: Array<Number> = [1, 2, 3, 4, 5];
  loading: boolean = false;
  isExistMovieWatchList: boolean = false;

  constructor(private activateRoute: ActivatedRoute,
    private store: AppState,
    private loaderService: LoaderService) {
    super();
  }

  ngOnInit(): void {
    this.loadMovieTitle();
  }

  loadMovieTitle(): void {
    this.loaderService.setLoading(true);
    this.loading = true;

    this.movieId = this.activateRoute?.snapshot?.paramMap?.get('id') as string;
    console.log(this.movieId);

    this.store.fetchCurrentTitle(this.movieId).
      pipe(takeUntil(this.destroy$)).subscribe(title => {
        console.log(title);
        this.title = title;
        this.loaderService.setLoading(false);
        this.loading = false;
        this.checkExistMovieWatchList(title)
      })
  }


  addMovieToWatchList(currentMovie: Title): void {
    currentMovie.isAdded = true;
    const modifiedMovie = this.typeMapper.mapTitleToWatchList(currentMovie);
    this.store.addToWatchList(modifiedMovie);
  }

  removeMovieFromWatchList(currentMovie: Title): void {
    const modifiedMovie = this.typeMapper.mapTitleToWatchList(currentMovie);
    this.store.removeFromWatchList(modifiedMovie);
    this.isExistMovieWatchList = false;
  }

  isStarFilled(value: string, index: number): boolean {
    const rating = parseFloat(value);
    const filledStars = Math.round(rating / 2);
    return index + 1 <= filledStars;
  }

  private getWatchListFromLocalStorage() {
    const storedWatchList = localStorage.getItem('watchList');
    return storedWatchList ? JSON.parse(storedWatchList) : [];
  }

  private checkExistMovieWatchList(title: Title): void {
    const localArray = this.getWatchListFromLocalStorage();
    const findedElem = localArray.find((movie: SearchDetail) => movie.imdbID === title.imdbID);
    this.isExistMovieWatchList = findedElem ? true : false;
  }

}
