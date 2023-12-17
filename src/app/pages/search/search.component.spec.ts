import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { AppState } from '../../api/state/app.state';
import { LoaderService } from '../../api/services/loader.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../api/services/api.service';
import { SearchDetail } from '../../api/types/search-detail';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, RouterLinkWithHref } from '@angular/router';
import { By } from '@angular/platform-browser';
import { ElementRef, QueryList } from '@angular/core';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let appState: AppState;
  let http: HttpClient;
  let apiService: ApiService;
  let storeServiceMock: jasmine.SpyObj<AppState>;
  let loaderServiceMock: jasmine.SpyObj<LoaderService>;
  let testedMovie: SearchDetail;


  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj('StoreService', ['searchByTitle', 'addToWatchList', 'searchSuggestions']);
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['setLoading']);

    await TestBed.configureTestingModule({
      imports: [SearchComponent, HttpClientModule],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        { provide: AppState, useValue: storeSpy },
        { provide: LoaderService, useValue: loaderSpy }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    http = TestBed.get(HttpClient);
    appState = new AppState(apiService);
    apiService = new ApiService(http);
    storeServiceMock = TestBed.inject(AppState) as jasmine.SpyObj<AppState>;
    loaderServiceMock = TestBed.inject(LoaderService) as jasmine.SpyObj<LoaderService>;
    testedMovie = { Poster: 'dvsd', Title: 'svzsg', Type: 'dvdsvsdb', Year: '2000', imdbID: '1', isWatched: false, isAdded: false }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should search for movies and update the component properties', () => {

    const moviesArray = [];
    moviesArray.push(testedMovie)
    const movies = { Response: 'True', Search: moviesArray, totalResults: 'True' };
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
    const movies = { Response: 'False', Search: moviesArray, totalResults: 'True' };

    storeServiceMock.searchByTitle.and.returnValue(of(movies));
    component.search();
    fixture.detectChanges();
    expect(movies.Response).toBe('False')
    expect(component.isShowError).toBe(true);

  });


  it('should set suggestions on successful getSuggestions call', () => {
    const mockResults = ['result1', 'result2'];
    storeServiceMock.searchSuggestions.and.returnValue(of(mockResults));

    component.searchTerm = 'abc';

    component.getSuggestions();

    expect(component.suggestions).toEqual(mockResults);
  });

  it('should handle error on failed getSuggestions call', () => {
    const mockError = new Error('Test error');
    storeServiceMock.searchSuggestions.and.returnValue(throwError(mockError));

    component.searchTerm = 'abc';

    component.getSuggestions();

    expect(component.suggestions).toEqual([]);
  });

  it('should call getSuggestions and reset suggestions and error state on onInputChange', () => {

    storeServiceMock.searchSuggestions.and.returnValue(of(['result1', 'result2']));

    component.suggestions = ['existing suggestion'];
    component.isShowError = true;

    component.onInputChange();

    expect(component.suggestions).toEqual([]);

    expect(component.isShowError).toBe(false);
  });

  it('should set searchTerm and reset suggestions on selectSuggestion', () => {
    const suggestion = 'selected suggestion';

    component.suggestions = ['existing suggestion'];

    component.selectSuggestion(suggestion);

    expect(component.searchTerm).toEqual(suggestion);

    expect(component.suggestions).toEqual([]);
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

    component.addToList(testedMovie);
    expect(storeServiceMock.addToWatchList).toHaveBeenCalledWith(testedMovie);

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
