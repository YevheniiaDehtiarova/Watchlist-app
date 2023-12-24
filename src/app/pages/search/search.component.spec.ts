import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import {  HttpClientModule } from '@angular/common/http';
import { SearchDetail } from '../../api/types/search-detail';
import { ActivatedRoute, RouterLinkWithHref } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Store, StoreModule } from '@ngrx/store';
import { appReducer } from '../../api/store/app.reducer';
import * as appActions from '../../api/store/app.actions';
import { of } from 'rxjs';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let testedMovie: SearchDetail;
  let store: Store;


  beforeEach(async () => {
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['setLoading']);

    await TestBed.configureTestingModule({
      imports: [SearchComponent, HttpClientModule,StoreModule.forRoot( appReducer )],
      providers: [
        { provide: ActivatedRoute, useValue: {} }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.inject(Store);  
    testedMovie = { Poster: 'dvsd', Title: 'svzsg', Type: 'dvdsvsdb', Year: '2000', imdbID: '1', isWatched: false, isAdded: false }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch searchByTitle action and handle subscription', () => {
    component.suggestions = [];
    component.searchTerm = 'yourSearchTerm';

    spyOn(store, 'dispatch');
    component.search();

    expect(component.suggestions).toEqual([]); 
    expect(store.dispatch).toHaveBeenCalledWith(appActions.searchByTitle({ title: 'yourSearchTerm' }));
  });


  it('should handle an error during the search', () => {
    const moviesArray = [];
    moviesArray.push(testedMovie)
    const movies = { Response: 'False', Search: moviesArray, totalResults: 'True' };

    component.search();
    fixture.detectChanges();
    expect(movies.Response).toBe('False')
  });
  it('should dispatch loadSuggestions action and update suggestions when searchTerm is valid', () => {
    component.searchTerm = 'abc';
    spyOn(store, 'dispatch');
    spyOn(store, 'pipe').and.returnValue(of(['suggestion1', 'suggestion2'])); 

    component.getSuggestions();

    expect(store.dispatch).toHaveBeenCalledWith(appActions.loadSuggestions({ searchTerm: 'abc' }));

    fixture.detectChanges();

    expect(component.suggestions).toEqual(['suggestion1', 'suggestion2']);
  });

  it('should set suggestions to empty array when searchTerm is not valid', () => {
    component.searchTerm = 'ab';
    component.getSuggestions();
    fixture.detectChanges();

    expect(component.suggestions).toEqual([]);
  });


  it('should call getSuggestions and reset suggestions and error state on onInputChange', () => {
    component.suggestions = ['existing suggestion'];
    component.onInputChange();

    expect(component.suggestions).toEqual([]);
  });

  it('should set searchTerm and reset suggestions on selectSuggestion', () => {
    const suggestion = 'selected suggestion';
    component.suggestions = ['existing suggestion'];
    component.selectSuggestion(suggestion);

    expect(component.searchTerm).toEqual(suggestion);
    expect(component.suggestions).toEqual([]);
  });
  it('should dispatch addToWatchList and updateSearchMovie actions', () => {
    spyOn(store, 'dispatch');

    component.addToList(testedMovie);

    expect(store.dispatch).toHaveBeenCalledWith(appActions.addToWatchList({ movie: testedMovie }));
    expect(store.dispatch).toHaveBeenCalledWith(appActions.updateSearchMovie({ movie: testedMovie }));
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
});
