import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { WatchListComponent } from './watch-list.component';
import { SearchDetail } from '../../api/types/search-detail';
import { AppState } from '../../state/app.state';
import { BehaviorSubject, of } from 'rxjs';
import { ApiService } from '../../api/services/api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterLinkWithHref } from '@angular/router';
import { By } from '@angular/platform-browser';
import { AppLocalState } from '../../state/app.local.state';

describe('WatchListComponent', () => {
  let component: WatchListComponent;
  let fixture: ComponentFixture<WatchListComponent>;
  let appState: AppState;
  let appLocalState: AppLocalState;
  let apiService: ApiService;
  let http: HttpClient;
  let testedMovie: SearchDetail;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchListComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [AppState, ApiService,AppLocalState]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WatchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    appState = new AppState(apiService);
    appLocalState = new AppLocalState();
    apiService = new ApiService(http);
    testedMovie = { Poster: 'dvsd',
      Title: 'svzsg',
      Type: 'dvdsvsdb',
      Year: '2000',
      imdbID: '1',
      isWatched: false,
      isAdded: false
    }
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



  it('should set the watchList in localStorage', () => {
    const watchListData = [];
    watchListData.push(testedMovie)
    appLocalState.updateWatchListLocalStorage(watchListData);
    const storedWatchList = localStorage.getItem('watchList');
    expect(JSON.parse(storedWatchList!)).toEqual(watchListData);
  });

  it('should remove movie from  the watchList in localStorage', () => {
    const watchListData = [];
    watchListData.push(testedMovie)
    appLocalState.updateWatchListLocalStorage(watchListData);
    appLocalState.removeWatchListFromLocalStorage(testedMovie,watchListData);
    const updatedWatchList = appLocalState.getWatchListFromLocalStorage();
    expect(updatedWatchList).toEqual(watchListData); 
  });
});
