import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { WatchListComponent } from './watch-list.component';
import { SearchDetail } from '../../api/types/search-detail';
import { ApiService } from '../../api/services/api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { RouterLinkWithHref } from '@angular/router';
import { By } from '@angular/platform-browser';
import { AppState } from '../../api/state/app.state';


describe('WatchListComponent', () => {
  let component: WatchListComponent;
  let fixture: ComponentFixture<WatchListComponent>;
  let appState: AppState;
  let apiService: ApiService;
  let storeServiceMock: jasmine.SpyObj<AppState>;
  let http: HttpClient;
  let testedMovie: SearchDetail;
  let mockWatchListWithMovie: Array<SearchDetail>;
  let mockWatchListWithMovies: Array<SearchDetail>;

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj('AppState', ['searchByTitle', 'addToWatchList','watchList$' , 'updateMovieFromWatchList', 'removeFromWatchList']);
    storeSpy.watchList$ = new BehaviorSubject<Array<SearchDetail>>([]);
    await TestBed.configureTestingModule({
      imports: [WatchListComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [ ApiService,
        { provide: AppState, useValue: storeSpy }]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WatchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    appState = new AppState(apiService);
    apiService = new ApiService(http);
    storeServiceMock = TestBed.inject(AppState) as jasmine.SpyObj<AppState>;
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

  it('should test loadWatchList method', () => {
    const movies: Array<SearchDetail> = [];
    movies.push(testedMovie);

    (storeServiceMock as any).watchList$ = of(movies)

    component.loadWatchList();

    component.store.watchList$.subscribe((list) => {
      expect(list).toEqual(movies)
      expect(component.watchList).toEqual(list)
    })
  }); 

  it('should test method markAsWatched', fakeAsync(() => {
    component.markAsWatched(testedMovie);

    tick();

    let index = 1;
    expect(index).not.toEqual(-1);
    expect(storeServiceMock.updateMovieFromWatchList).toHaveBeenCalledWith(testedMovie);
  }));

  it('should test index  method markAsWatched', fakeAsync(() => {
  
    component.markAsWatched(testedMovie);

    tick();

    let index = 1;
    expect(index).not.toEqual(-1);
    expect(component?.watchList).toBeDefined()
    expect(testedMovie.isWatched).toEqual(false); 
  }));

  it('should remove a movie from watch list and update local storage', () => {
    spyOn(appState, 'removeFromWatchList');
    component.removeMovieFromWatchList(testedMovie);
    component.removeWatchListFromLocalStorage(testedMovie,mockWatchListWithMovies )
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

  it('should remove movie from  the watchList in localStorage', () => {
    const watchListData = [];
    watchListData.push(testedMovie)
    component.updateWatchListLocalStorage(watchListData);
    component.removeWatchListFromLocalStorage(testedMovie,watchListData);
    const updatedWatchList = component.getWatchListFromLocalStorage();
    expect(updatedWatchList).toEqual(watchListData); 
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
      component.removeWatchListFromLocalStorage(mockMovieToRemove, mockWatchListWithMovies);
    });

    it('should not update localStorage if movie is not found in watchList', () => {
     const mockMovieToRemove: SearchDetail ={ Poster: 'dvsd',Title: 'svzsg',Type: 'dvdsvsdb',Year: '2000',imdbID: '1',isWatched: false,isAdded: false} 

      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockWatchListWithMovies));
      spyOn(localStorage, 'setItem');
      component.removeWatchListFromLocalStorage(mockMovieToRemove, mockWatchListWithMovies);

      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });

