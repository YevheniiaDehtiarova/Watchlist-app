import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { WatchListComponent } from './watch-list.component';
import { SearchDetail } from '../../api/types/search-detail';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterLinkWithHref } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Store, StoreModule, select } from '@ngrx/store';
import { appReducer } from '../../api/store/app.reducer';
import * as appActions from './../../api/store/app.actions';
import { of } from 'rxjs';



describe('WatchListComponent', () => {
  let component: WatchListComponent;
  let fixture: ComponentFixture<WatchListComponent>;
  let store: Store;
  let testedMovie: SearchDetail;
  let mockWatchListWithMovie: Array<SearchDetail>;
  let mockWatchListWithMovies: Array<SearchDetail>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [WatchListComponent, HttpClientTestingModule, RouterTestingModule,StoreModule.forRoot( appReducer )]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WatchListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
    testedMovie = { Poster: 'dvsd',Title: 'svzsg',Type: 'dvdsvsdb',
      Year: '2000',imdbID: '1',isWatched: false,isAdded: false
    }
    mockWatchListWithMovie = [{ Poster: 'dvsd',Title: 'svzsg',Type: 'dvdsvsdb',Year: '2000',imdbID: '1',isWatched: false,isAdded: false}]
    mockWatchListWithMovies = [{ Poster: 'dvsd',Title: 'svzsg',Type: 'dvdsvsdb',Year: '2000',imdbID: '2',isWatched: false,isAdded: false}]
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should call loadWatchList on ngOnInit', () => {
    spyOn(component, 'loadWatchList');
    component.ngOnInit();
    expect(component.loadWatchList).toHaveBeenCalled();
  });

  
  it('should have a router link to /search', () => {
    fixture.detectChanges();

    const debugElements = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
    const hasRouterLink = debugElements.some((debugElement) => {
      const routerLink = debugElement.injector.get(RouterLinkWithHref);
      return routerLink['commands'].toString() === '/search';
    });

    expect(hasRouterLink).toBeTruthy();
  });

  it('should load watchList from store when it has items', () => {
    spyOn(store, 'pipe').and.returnValue(of(mockWatchListWithMovie));

    component.loadWatchList();
    expect(store.pipe).toHaveBeenCalled();
    expect(component.watchList).toEqual(mockWatchListWithMovie);
  });

  it('should load watchList from local storage when it is empty', () => {
    spyOn(store, 'pipe').and.returnValue(of([]));
    spyOn(component, 'getWatchListFromLocalStorage').and.returnValue([
     testedMovie
    ]);
    spyOn(store, 'dispatch');

    component.loadWatchList();

    expect(store.pipe).toHaveBeenCalled();
    expect(component.getWatchListFromLocalStorage).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(appActions.addMoviesToWatchList({movies: mockWatchListWithMovie }));
  });



  it('should test index  method markAsWatched', fakeAsync(() => {
    component.markAsWatched(testedMovie);

    tick();
    let index = 1;
    expect(index).not.toEqual(-1);
    expect(component?.watchList).toBeDefined()
    expect(testedMovie.isWatched).toEqual(false); 
  }));

  it('should remove a movie from watch list and update local storage', () => {
    component.removeMovieFromWatchList(testedMovie);
    component.removeWatchListFromLocalStorage(testedMovie )
  });

  it('should dispatch updateMovieFromWatchList action and update local storage when marking as watched', () => {
    spyOn(store, 'dispatch');
    spyOn(component, 'updateWatchListIndex').and.returnValue(0);
    spyOn(component, 'getWatchListFromLocalStorage').and.returnValue([testedMovie]);
    spyOn(component, 'updateWatchListLocalStorage');

    component.markAsWatched(testedMovie);

    expect(store.dispatch).toHaveBeenCalledWith(appActions.updateMovieFromWatchList({ movie: testedMovie }));
    expect(component.updateWatchListIndex).toHaveBeenCalledWith(testedMovie);
  });

  it('should not update local storage if movie is not in watchList', () => {

    spyOn(store, 'dispatch');
    spyOn(component, 'updateWatchListIndex').and.returnValue(-1);
    spyOn(component, 'getWatchListFromLocalStorage');
    spyOn(component, 'updateWatchListLocalStorage');

    component.markAsWatched(testedMovie);

    expect(store.dispatch).toHaveBeenCalledWith(appActions.updateMovieFromWatchList({ movie: testedMovie }));
    expect(component.updateWatchListIndex).toHaveBeenCalledWith(testedMovie);
    expect(component.getWatchListFromLocalStorage).not.toHaveBeenCalled();
    expect(component.updateWatchListLocalStorage).not.toHaveBeenCalled();
  });


  it('should return the correct index when movie is in watchList', () => {
    const movieInList: SearchDetail = {
      Poster: 'dvsd',Title: 'svzsg',Type: 'dvdsvsdb',
      Year: '2000',imdbID: '2',isWatched: false,isAdded: false
    };

    component.watchList = [
      testedMovie,
      movieInList,
      { Poster: 'dvsd',Title: 'svzsg',Type: 'dvdsvsdb',
      Year: '2000',imdbID: '2',isWatched: false,isAdded: false
    }
    ];
    component.updateWatchListIndex(movieInList);
    const index = component.updateWatchListIndex(movieInList);
    expect(index).toEqual(1);
  });

  it('should return -1 when movie is not in watchList', () => {
    const movieNotInList: SearchDetail = {
      Poster: 'dvsd',Title: 'svzsg',Type: 'dvdsvsdb',
      Year: '2000',imdbID: '99',isWatched: false,isAdded: false
    };

    component.watchList = [
     testedMovie
    ];

    component.updateWatchListIndex(movieNotInList);
    const index = component.updateWatchListIndex(movieNotInList);
    expect(index).toEqual(-1);
  });

  it('should set the watchList in localStorage', () => {
    const watchListData = [];
    watchListData.push(testedMovie)
    component.updateWatchListLocalStorage(watchListData);
    const storedWatchList = localStorage.getItem('watchList');
    expect(JSON.parse(storedWatchList!)).toEqual(watchListData);
  });


    it('should return an array of SearchDetail from localStorage', () => {
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockWatchListWithMovie));
      const result = component.getWatchListFromLocalStorage();
      expect(result).toEqual(mockWatchListWithMovie);
    });
  

    it('should update localStorage with the provided watchList', () => {
      spyOn(localStorage, 'setItem')
      component.updateWatchListLocalStorage(mockWatchListWithMovie);
      expect(localStorage.setItem).toHaveBeenCalledWith('watchList', JSON.stringify(mockWatchListWithMovie));
    });
  

    it('should remove the movie from watchList and update localStorage', () => {
      const mockMovieToRemove: SearchDetail = { Poster: 'dvsd',Title: 'svzsg',Type: 'dvdsvsdb',Year: '2000',imdbID: '1',isWatched: false,isAdded: false} 
      component.removeWatchListFromLocalStorage(mockMovieToRemove);
    });

    it('should not update localStorage if movie is not found in watchList', () => {
     const mockMovieToRemove: SearchDetail ={ Poster: 'dvsd',Title: 'svzsg',Type: 'dvdsvsdb',Year: '2000',imdbID: '1',isWatched: false,isAdded: false} 

      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockWatchListWithMovies));
      spyOn(localStorage, 'setItem');
      component.removeWatchListFromLocalStorage(mockMovieToRemove);

      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });

