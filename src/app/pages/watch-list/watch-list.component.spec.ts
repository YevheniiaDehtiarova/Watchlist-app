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
      imports: [WatchListComponent, HttpClientTestingModule, RouterTestingModule, StoreModule.forRoot(appReducer)]
    })
      .compileComponents();

    fixture = TestBed.createComponent(WatchListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
    testedMovie = {
      Poster: 'dvsd', Title: 'svzsg', Type: 'dvdsvsdb',
      Year: '2000', imdbID: '1', isWatched: false, isAdded: false
    }
    mockWatchListWithMovie = [{ Poster: 'dvsd', Title: 'svzsg', Type: 'dvdsvsdb', Year: '2000', imdbID: '1', isWatched: false, isAdded: false }]
    mockWatchListWithMovies = [{ Poster: 'dvsd', Title: 'svzsg', Type: 'dvdsvsdb', Year: '2000', imdbID: '2', isWatched: false, isAdded: false }]
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


  it('should dispatch updateMovieFromWatchList action and update local storage when marking as watched', () => {
    spyOn(store, 'dispatch');
    component.markAsWatched(testedMovie);
    expect(store.dispatch).toHaveBeenCalledWith(appActions.updateMovieFromWatchList({ movie: testedMovie }));
  });

  it('should not update local storage if movie is not in watchList', () => {
    spyOn(store, 'dispatch');
    component.markAsWatched(testedMovie);

    expect(store.dispatch).toHaveBeenCalledWith(appActions.updateMovieFromWatchList({ movie: testedMovie }));
  });


  it('should return an array of SearchDetail from localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockWatchListWithMovie));
    const result = component.getWatchListFromLocalStorage();
    expect(result).toEqual(mockWatchListWithMovie);
  });
});

