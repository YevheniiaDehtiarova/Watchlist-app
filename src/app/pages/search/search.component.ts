import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Observable, concat, debounceTime, distinctUntilChanged, pipe, take, takeUntil } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { SearchDetail } from '../../api/types/search-detail';
import { RouterLink } from '@angular/router';
import { BaseComponent } from '../base.component';
import { LoaderComponent } from '../loader/loader.component';
import { LoaderService } from '../../api/services/loader.service';
import { Store, select } from '@ngrx/store';
import * as appActions from '../../api/store/app.actions'
import { selectLoading, selectSearchError, selectSearchMovies, selectSuggestions } from '../../api/store/app.selector';
import { AppState } from '../../api/store/app.state';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [NgFor, FormsModule, CommonModule, RouterLink, LoaderComponent, NgIf, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent extends BaseComponent implements OnInit {
  @ViewChildren('addToYourListBtn') addToYourListBtns!: QueryList<ElementRef>;

  movies$: Observable<Array<SearchDetail>> = this.store.pipe(select(selectSearchMovies));
  loading$: Observable<boolean> = this.store.select(selectLoading);
  searchError$!: Observable<any>;
  searchTerm!: string;
  suggestions: string[] = [];
  isMovieAdded: boolean = false;
  searchForm: FormGroup | undefined;

  constructor(public store: Store<AppState>, private loader: LoaderService) {
    super();
  }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      searchTerm: new FormControl()
    });
  }

  search(): void {
    this.suggestions = [];
    this.store.dispatch(appActions.searchByTitle({ title: this.searchTerm }));
    this.searchError$ = this.store.select(selectSearchError);
  }

  onInputChange() {
    this.searchTerm = this.searchForm?.get('searchTerm')?.value;
    if (this.searchForm) {
      this.searchForm?.get('searchTerm')?.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.getSuggestions();
        });
    }
    this.suggestions = [];
  }

  selectSuggestion(suggestion: string) {
    this.searchTerm = suggestion;
    this.suggestions = [];
    this.searchForm?.get('searchTerm')?.setValue(suggestion);
  }

  getSuggestions() {
    if (this.searchTerm && this.searchTerm.length >= 3) {
      this.store.dispatch(appActions.loadSuggestions({ searchTerm: this.searchTerm }))
      this.store.pipe(select(selectSuggestions), pipe(takeUntil(this.destroy$))).subscribe((result) => {
        return this.suggestions = result;
      })
    } else {
      this.suggestions = [];
    }
  }

  addToList(movie: SearchDetail): void {
    this.store.dispatch(appActions.addToWatchList({ movie }));
    this.store.dispatch(appActions.updateSearchMovie({ movie }))
  }

  onTitleHover(index: number) {
    const button = this.addToYourListBtns.toArray()[index]?.nativeElement;
    if (button) {
      button.style.display = 'flex';
    }
  }

}
