import { Component, OnInit, inject } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, map, pairwise, pipe, takeUntil, tap } from 'rxjs';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { SearchDetail } from '../../api/types/search-detail';
import { RouterLink } from '@angular/router';
import { BaseComponent } from '../base.component';
import { LoaderComponent } from '../loader/loader.component';
import { Store } from '@ngrx/store';
import * as appActions from '../../api/store/app.actions'
import { selectLoading, selectSearchError, selectSearchMovies, selectSuggestions } from '../../api/store/app.selector';
import { StoreInterface } from '../../api/store/app.state';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [NgFor, FormsModule, CommonModule, RouterLink, LoaderComponent, NgIf, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent extends BaseComponent implements OnInit {
  public store = inject(Store<StoreInterface>)
  public readonly loading$ = this.store.select(selectLoading);
  public readonly movies$ = this.store.select(selectSearchMovies);
  public readonly searchError$ = this.store.select(selectSearchError);
  public readonly suggestions$ = this.store.select(selectSuggestions);

  isMovieAdded: boolean = false;
  searchForm: FormGroup = new FormGroup({
    searchTerm: new FormControl()
  });


  ngOnInit(): void {
    this.searchForm?.get('searchTerm')?.valueChanges
      .pipe(
        pairwise(),
        tap(([prev, curr]) => {
          if (!Boolean(prev) || prev.length < 3) return;
          if (!Boolean(curr) || curr.length < 3) {
            this.store.dispatch(appActions.clearSuggestions())
          };
        }),
        map(([, e]) => e),
        filter(value => !!value),
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        this.store.dispatch(appActions.loadSuggestions({ searchTerm: value }))
      });
  }


  search(): void {
    this.store.dispatch(appActions.clearSuggestions());
    const title = this.searchForm?.get('searchTerm')?.value;
    this.store.dispatch(appActions.searchByTitle({ title }));
  }



  selectSuggestion(suggestion: string) {
    this.searchForm?.get('searchTerm')?.setValue(suggestion, { emitEvent: false });
    this.store.dispatch(appActions.clearSuggestions());
  }


  addToList(movie: SearchDetail): void {
    this.store.dispatch(appActions.addToWatchList({ movie }));
    this.store.dispatch(appActions.updateSearchMovie({ movie }))
  }

}
