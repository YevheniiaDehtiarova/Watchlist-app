import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { AppState } from '../../state/app.state';
import { AppLocalState } from '../../state/app.local.state';
import { LoaderService } from '../../api/services/loader.service';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../api/services/api.service';
import { SearchDetail } from '../../api/types/search-detail';
import { of } from 'rxjs';
import { ActivatedRoute, RouterLinkWithHref } from '@angular/router';
import { By } from '@angular/platform-browser';
import { ElementRef, QueryList } from '@angular/core';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let appState: AppState;
  let appLocalState: AppLocalState;
  let http: HttpClient;
  let apiService: ApiService;
  let storeServiceMock: jasmine.SpyObj<AppState>;
  let loaderServiceMock: jasmine.SpyObj<LoaderService>;
  let localStateMock: jasmine.SpyObj<AppLocalState>;
  let testedMovie: SearchDetail;
  

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj('StoreService', ['searchByTitle', 'addToWatchList']);
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['setLoading']);
    const localStateSpy = jasmine.createSpyObj('AppLocalState', ['getWatchListFromLocalStorage', 'updateWatchListLocalStorage']);
    await TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [AppState,AppLocalState,
        { provide: ActivatedRoute, useValue: {} },
        { provide: AppState, useValue: storeSpy },
        { provide: LoaderService, useValue: loaderSpy },
        { provide: AppLocalState, useValue: localStateSpy },]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    appState = new AppState(apiService);
    appLocalState = new AppLocalState();
    apiService = new ApiService(http);
    storeServiceMock = TestBed.inject(AppState) as jasmine.SpyObj<AppState>;
    loaderServiceMock = TestBed.inject(LoaderService) as jasmine.SpyObj<LoaderService>;
    localStateMock = TestBed.inject(AppLocalState) as jasmine.SpyObj<AppLocalState>;
    testedMovie = { Poster: 'dvsd',Title: 'svzsg',Type: 'dvdsvsdb',Year: '2000',
    imdbID: '1',isWatched: false,isAdded: false}
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should search for movies and update the component properties', () => {
  
    const moviesArray = [];
    moviesArray.push(testedMovie)
    const movies = { Response: 'True', Search: moviesArray,  totalResults: 'True'};
    storeServiceMock.searchByTitle.and.returnValue(of(movies));
    component.search();
    expect(component.loading).toBe(false);
    expect(loaderServiceMock.setLoading).toHaveBeenCalledWith(true);

    fixture.detectChanges(); 

    expect(component.movies).toEqual(movies.Search);
    expect(component.isShowError).toBe(false);

    expect(loaderServiceMock.setLoading).toHaveBeenCalledWith(false);
    expect(component.loading).toBe(false);
  }); 

  it('should handle an error during the search', () => {
    const moviesArray = [];
    moviesArray.push(testedMovie)
    const movies = { Response: 'False', Search: moviesArray,  totalResults: 'True'};

    storeServiceMock.searchByTitle.and.returnValue(of(movies));
    component.search();
    fixture.detectChanges(); 
    expect(movies.Response).toBe('False')
    expect(component.isShowError).toBe(true);

  });

  it('should have a router link to /search', () => {
    fixture.detectChanges();

    const debugElements = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));

    const hasRouterLink = debugElements.some((debugElement) => {
      const routerLink = debugElement.injector.get(RouterLinkWithHref);
      return routerLink['commands'].toString() === '/';
    });

    expect(hasRouterLink).toBeTruthy();
  });

  it('should add a movie to the watch list and update local storage', () => {
    localStateMock.getWatchListFromLocalStorage.and.returnValue([]);

    component.addToList(testedMovie);
    expect(storeServiceMock.addToWatchList).toHaveBeenCalledWith(testedMovie);

    expect(localStateMock.updateWatchListLocalStorage).toHaveBeenCalledWith([testedMovie]);
    expect(testedMovie.isAdded).toBe(true);
  });


  it('should set the display style of the button for a given index', () => {
    component.addToYourListBtns = new QueryList<ElementRef>();
    component.addToYourListBtns.reset([
      { nativeElement: { style: { display: 'none' } } },
      { nativeElement: { style: { display: 'none' } } },
    ]);

    const indexToHover = 1; 
    component.onTitleHover(indexToHover);

    const buttonsArray = component.addToYourListBtns.toArray();

    const buttonAtIndex = buttonsArray[indexToHover]?.nativeElement;
    expect(buttonAtIndex.style.display).toBe('flex');
  });

  it('should handle cases where addToYourListBtns array is not fully populated', () => {
    component.addToYourListBtns = new QueryList<ElementRef>();
    component.addToYourListBtns.reset([])

    const indexToHover = 0; 
    component.onTitleHover(indexToHover);
    expect(component.addToYourListBtns.length).toBe(0);
  });
});
