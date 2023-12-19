import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Observable, concat, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { SearchDetail } from '../../api/types/search-detail';
import { RouterLink } from '@angular/router';
import { BaseComponent } from '../base.component';
import { LoaderComponent } from '../loader/loader.component';
import { LoaderService } from '../../api/services/loader.service';
import { Store, select } from '@ngrx/store';
import * as appActions from '../../api/store/app.actions'
import { selectSearchMovies, selectSuggestions } from '../../api/store/app.selector';
import { AppState } from '../../api/store/app.state';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [NgFor, FormsModule, CommonModule, RouterLink, LoaderComponent, NgIf],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent extends BaseComponent implements OnInit {
  @ViewChildren('addToYourListBtn') addToYourListBtns!: QueryList<ElementRef>;

  movies: Array<SearchDetail> = [];
  movies$!:  Observable<Array<SearchDetail>>;
  loading: boolean = false;
  searchTerm: string = '';
  suggestions: string[] = [];
  isShowError: boolean = false;


  constructor(public store: Store<AppState>, private loader: LoaderService) {
    super();
  }

  ngOnInit(): void { }



  search(): void {
    this.loading = true;
    this.loader.setLoading(true);
    this.suggestions = [];

    this.store.dispatch(appActions.searchByTitle({ title: this.searchTerm}));

    this.movies$ = this.store.pipe(select(selectSearchMovies));
    this.movies$.subscribe(movie => {
      console.log(movie)
    })

    this.loader.setLoading(false);
    this.loading = false;
  }

  onInputChange() {
    this.getSuggestions();
    this.suggestions = [];
    this.isShowError = false;
  }

  selectSuggestion(suggestion: string) {
    this.searchTerm = suggestion;
    this.suggestions = [];
  }

  getSuggestions() {
    if (this.searchTerm && this.searchTerm.length >= 3) {
      this.store.dispatch(appActions.loadSuggestions({searchTerm: this.searchTerm}))
      this.store.pipe(select(selectSuggestions)).subscribe((result) => {
        console.log(result, 'res in suggest')
        return this.suggestions = result;
      })
    } else {
      this.suggestions = []; 
    }
  }

  addToList(movie: SearchDetail): void {
    movie.isAdded = true;
    this.store.dispatch(appActions.addToWatchList({ movie }));
  }

  onTitleHover(index: number) {
    const button = this.addToYourListBtns.toArray()[index]?.nativeElement;
    if (button) {
      button.style.display = 'flex';
    }
  }

}
