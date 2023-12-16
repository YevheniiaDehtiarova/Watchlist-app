import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AppState } from '../../state/app.state';
import { takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { SearchDetail } from '../../api/types/search-detail';
import { RouterLink } from '@angular/router';
import { BaseComponent } from '../base.component';
import { LoaderComponent } from '../loader/loader.component';
import { LoaderService } from '../../api/services/loader.service';
import { ApiService } from '../../api/services/api.service';

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
  loading: boolean = false;
  searchTerm: string = '';
  suggestions: string[] = [];
  isShowError: boolean = false;


  constructor(private store: AppState, private loader: LoaderService) {
    super();
  }

  ngOnInit(): void { }



  search(): void {
    this.loading = true;
    this.loader.setLoading(true);
    this.suggestions = [];

    this.store.searchByTitle(this.searchTerm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (movies) => {
          if (movies.Response === 'False') {
            this.isShowError = true;
          }
          this.movies = movies.Search;
        },
        error: () => { },
        complete: () => {
          this.loader.setLoading(false);
          this.loading = false;
        }
      });
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
      this.store.searchSuggestions(this.searchTerm)
        .pipe(takeUntil(this.destroy$)).subscribe({
          next: (results) => {
            this.suggestions = results;
          },
          error: (error) => {}
        });
    } else {
      this.suggestions = [];
    }
  }

  addToList(movie: SearchDetail): void {
    movie.isAdded = true;
    this.store.addToWatchList(movie);
  }

  onTitleHover(index: number) {
    const button = this.addToYourListBtns.toArray()[index]?.nativeElement;
    if (button) {
      button.style.display = 'flex';
    }
  }

}
