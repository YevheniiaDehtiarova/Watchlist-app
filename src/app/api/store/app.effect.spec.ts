import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import {  Observable, of, throwError } from 'rxjs';
import { AppEffects } from './app.effects';
import * as appActions from './app.actions';
import { ApiService } from '../services/api.service';
import { LoaderService } from '../services/loader.service';
import { cold, hot } from 'jasmine-marbles';
import { SearchDetail } from '../types/search-detail';
;

describe('AppEffects', () => {
  let effects: AppEffects;
  let actions: Observable<any>;
  let apiService: jasmine.SpyObj<ApiService>;
  let loaderService: jasmine.SpyObj<LoaderService>;

  

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppEffects,
        provideMockActions(() => actions), 
        { provide: ApiService, useValue: jasmine.createSpyObj('ApiService', ['getByTitle']) },
        { provide: LoaderService, useValue: jasmine.createSpyObj('LoaderService', ['setLoading']) },
      ],
    });

    effects = TestBed.inject(AppEffects);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    loaderService = TestBed.inject(LoaderService) as jasmine.SpyObj<LoaderService>;
  
  });

  

  it('should dispatch fetchCurrentTitleSuccess action on successful API call', () => {
    const movieId = '123';
    const action = appActions.fetchCurrentTitle({ id: movieId });
    const currentTitle = {Title: 'abc',Year: 'abc',Rated: 'abc',Released: 'abc',Runtime: 'abc',Genre: 'abc',Director: 'abc',Writer: 'abc',
    Actors: 'abc',Plot: 'abc',Language: 'abc',Country: 'abc',Awards: 'abc',Poster: 'abc',Ratings: [{
    Source: 'abc',Value: 'abc'}],Metascore: 'abc',imdbRating: 'abc',imdbVotes: 'abc',imdbID: 'abc', Type: 'abc',totalSeasons: 'abc',Response: "'True'",Error: 'abc',isAdded: false };

    apiService.getByTitle.and.returnValue(of(currentTitle as any));


    actions = cold('-a', { a: action });

    effects.fetchCurrentTitle$.subscribe(() => {
        expect(loaderService.setLoading).toHaveBeenCalledWith(true);
        expect(loaderService.setLoading).toHaveBeenCalledWith(false);
      });
    });
 

  it('should dispatch searchSuccess action on successful API call', () => {
    const title = 'movie_title';
    const action = appActions.searchByTitle({ title });
    const movies = { Response: 'abc', Error: 'abc', Search: [{ Poster: 'dvsd', Title: 'svzsg', Type: 'dvdsvsdb', Year: '2000', imdbID: '1', isWatched: false, isAdded: false }], totalResults: 5 };

    actions = cold('-a', { a: action });

    apiService.search.and.returnValue(of(movies as any));

    effects.searchByTitle$.subscribe(() => {
      expect(loaderService.setLoading).toHaveBeenCalledWith(true);
      expect(loaderService.setLoading).toHaveBeenCalledWith(false);
    });
  });

  it('should dispatch searchFailure action on API error', () => {
    const title = 'movie_title';
    const action = appActions.searchByTitle({ title });
    const error = { Error: 'API error' };

    actions = cold('-a', { a: action });

    apiService.search.and.returnValue(throwError(error));

    effects.searchByTitle$.subscribe(() => {
      expect(loaderService.setLoading).toHaveBeenCalledWith(true);
      expect(loaderService.setLoading).toHaveBeenCalledWith(false);
    });
  });

  it('should dispatch loadSuggestionsSuccess action on successful API call', () => {
    const searchTerm = 'test';
    const action = appActions.loadSuggestions({ searchTerm });
    const suggestions = ['suggestion1', 'suggestion2'];

    actions = hot('-a', { a: action });

    apiService.getSuggestions.and.returnValue(of(suggestions));

    const expectedAction = appActions.loadSuggestionsSuccess({ suggestions });

    effects.loadSuggestions$.subscribe((resultAction) => {
      expect(resultAction).toEqual(expectedAction);
    });
  });
  it('should dispatch loadSuggestionsFailure action on API error', () => {
    const searchTerm = 'test';
    const action = appActions.loadSuggestions({ searchTerm });
    const error = 'API error';

    actions = hot('-a', { a: action });

    apiService.getSuggestions.and.returnValue(throwError(error));

    const expectedAction = appActions.loadSuggestionsFailure({ error });

    effects.loadSuggestions$.subscribe((resultAction) => {
      expect(resultAction).toEqual(expectedAction);
    });
  });

});

