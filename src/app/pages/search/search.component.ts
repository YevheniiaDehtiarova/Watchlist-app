import { Component, ElementRef, OnInit, QueryList, ViewChild, } from '@angular/core';
import { Observable, Subscription, debounceTime, distinctUntilChanged, pipe, takeUntil } from 'rxjs';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { SearchDetail } from '../../api/types/search-detail';
import { RouterLink } from '@angular/router';
import { BaseComponent } from '../base.component';
import { LoaderComponent } from '../loader/loader.component';
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
  @ViewChild('backButton') backListBtn!: ElementRef;

  movies$!: Observable<Array<SearchDetail>>;
  loading$!: Observable<boolean>;
  searchError$!: Observable<any>;
  searchTerm: string = '';
  suggestions: string[] = [];
  isMovieAdded: boolean = false;
  searchForm: FormGroup | undefined;
  private searchTermSubscription: Subscription | undefined;

  constructor(public store: Store<AppState>) {
    super();
  }
  //Подписка на каждое изменение search input приводит к тому, что в итоге все равно потом отправляется много запросов.
  // Решение этого - подписаться на изменения один раз (например, в ngOnInit)
  //Отдельная переменная suggestions в компоненте тоже лишняя, можно было бы оставить весь их менеджмент в state


  ngOnInit(): void {
    this.searchForm = new FormGroup({
      searchTerm: new FormControl()
    });
    this.loading$ = this.store.select(selectLoading);
    //this.fetchData();
  }

/*   fetchData(){
    this.movies$ = this.store.select(selectSearchMovies);
    this.searchError$ = this.store.select(selectSearchError);
    this.store.dispatch(appActions.searchWithSuggestions({ search: this.searchTerm }));
    console.log('fetch data works')
  }

  onSearchSubmit(){
    this.searchTerm = this.searchForm?.value ?? '';
    console.log(this.searchTerm, 'on search submit works');
    this.fetchData();
  } */



  search(): void {
    this.suggestions = [];
    this.backListBtn.nativeElement.style.display = 'flex';
    this.store.dispatch(appActions.searchByTitle({ title: this.searchTerm })); 
  /// this.store.dispatch(appActions.searchWithSuggestions({ search: this.searchTerm }));
   console.log('search works')
    this.movies$ = this.store.select(selectSearchMovies);
    this.searchError$ = this.store.select(selectSearchError);

    if (this.searchForm) {
      this.searchTermSubscription?.unsubscribe();
    }
  }

  onInputChange() {
    this.searchTerm = this.searchForm?.get('searchTerm')?.value;
    if (this.searchForm) {
      this.searchTermSubscription =  this.searchForm?.get('searchTerm')?.valueChanges // modify with click search stream
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
     /*  this.store.dispatch(appActions.searchWithSuggestions({ search: this.searchTerm })); */
      this.store.dispatch(appActions.loadSuggestions({ searchTerm: this.searchTerm }))
      this.store.pipe(select(selectSuggestions), pipe(takeUntil(this.destroy$))).subscribe((result) => {
        console.log(result, 'result in get suggestion')
        if (window.innerWidth <= 576) {
          this.backListBtn.nativeElement.style.display = 'none';// made by css
        }
        console.log('if in get suggestion works')
        return this.suggestions = result;
      })
    } else {
      console.log('else in get suggestion works')
      this.suggestions = [];
      this.backListBtn.nativeElement.style.display = 'flex';
    }
  }

  addToList(movie: SearchDetail): void {
    this.store.dispatch(appActions.addToWatchList({ movie }));
    this.store.dispatch(appActions.updateSearchMovie({ movie }))
  }

}
