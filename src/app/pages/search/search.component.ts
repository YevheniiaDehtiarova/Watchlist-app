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
import { AppLocalState } from '../../state/app.local.state';

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
  isShowError: boolean = false;


  constructor(private store: AppState, private loader: LoaderService, private localState: AppLocalState) {
    super();
  }

  ngOnInit(): void { }

  /*  search(event: any): void {
     this.movie$ = this.store.searchByTitle(event.target.value);
 
     this.movie$.pipe(takeUntil(this.destroy$)).subscribe((movies) => {
       console.log(movies, 'movie');
       this.movies = movies.Search;
       console.log(this.movies, 'list of movies')
     })
   } */


  search(): void {
    this.loading = true;
    this.loader.setLoading(true);

    this.store.searchByTitle(this.searchTerm)
      .pipe(takeUntil(this.destroy$))
      .subscribe((movies) => {
        console.log(movies, 'movie');
        if (movies.Response === 'False') {
          this.isShowError = true;
        }
        this.movies = movies.Search;
        console.log(this.movies, 'list of movies');
      },
        () => {},
        () => {
          this.loader.setLoading(false);
          this.loading = false;
        });
  }

  addToList(movie: SearchDetail): void {
    console.log(movie, 'movie to add');
    movie.isAdded = true;
    this.store.addToWatchList(movie);
    const localArray = this.localState.getWatchListFromLocalStorage();
    localArray.push(movie);
    this.localState.updateWatchListLocalStorage(localArray)
  }

  onTitleHover(index: number) { 
    console.log('title hover works', index)
    const button = this.addToYourListBtns.toArray()[index]?.nativeElement;
    if(button){
      button.style.display = 'flex';
    }
  }

}
