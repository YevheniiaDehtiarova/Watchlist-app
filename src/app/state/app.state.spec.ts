import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from '../api/services/api.service';
import { AppState } from './app.state';
import { of } from 'rxjs';
import { Title } from '../api/types/title';
import { SearchDetail } from '../api/types/search-detail';



describe('AppState', () => {
  let appState: AppState;
  let apiService: ApiService;
  let httpMock: HttpTestingController;
  let testedMovie: SearchDetail;
 

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', ['getSuggestions']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppState, ApiService]
    });
    appState = TestBed.inject(AppState);
    apiService = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
    testedMovie = { Poster: 'dvsd',Title: 'svzsg',Type: 'dvdsvsdb',Year: '2000',imdbID: '1',isWatched: false,isAdded: false}
  });

  it('should be created', () => {
    expect(appState).toBeTruthy();
  });

  it('should fetch current title from API', () => {
    const title = 'The Movie Title';
    const mockApiResponse: null | Title = {Title: 'abc',Year: 'abc',Rated: 'abc',Released: 'abc',Runtime: 'abc',Genre: 'abc',Director: 'abc',Writer: 'abc',
    Actors: 'abc',Plot: 'abc',Language: 'abc',Country: 'abc',Awards: 'abc',Poster: 'abc',Ratings: [{
    Source: 'abc',Value: 'abc'}],Metascore: 'abc',imdbRating: 'abc',imdbVotes: 'abc',imdbID: 'abc', Type: 'abc',totalSeasons: 'abc',Response: 'True',Error: 'abc',isAdded: false, };
    spyOn(apiService, 'getByTitle').and.returnValue(of(mockApiResponse));

    appState.fetchCurrentTitle(title);
    expect(apiService.getByTitle).toHaveBeenCalledWith(title);

  });

  it('should search by title using API', () => {
    const title = 'The Movie Title';
    const moviesArray = [];
    moviesArray.push(testedMovie)
    const mockSearchResults = { Response: 'True', Search: moviesArray,  totalResults: 'True'};
    spyOn(apiService, 'search').and.returnValue(of(mockSearchResults));

    const result = appState.searchByTitle(title);

    expect(apiService.search).toHaveBeenCalledWith(title);
    result.subscribe((searchResults) => {
      expect(searchResults).toEqual(mockSearchResults);
    });
  });

  it('should return suggestions from the API', () => {
    const searchTerm = 'test';
    const mockSuggestions = ['suggestion1', 'suggestion2'];

    spyOn(apiService, 'getSuggestions').and.returnValue(of(mockSuggestions));

    appState.searchSuggestions(searchTerm).subscribe((suggestions) => {
      expect(suggestions).toEqual(mockSuggestions);
    });

    expect(apiService.getSuggestions).toHaveBeenCalledWith(searchTerm);
  });

  it('should add a movie to the watch list if it does not exist', () => {
    const initialWatchList: SearchDetail[] = [];
    appState.watchList.next(initialWatchList);

    const watchListNextSpy = spyOn(appState.watchList, 'next').and.callThrough();
    appState.addToWatchList(testedMovie);

    expect(watchListNextSpy).toHaveBeenCalledWith([testedMovie]);
  });

  it('should remove a movie from the watch list if it exists', () => {
    const initialWatchList: SearchDetail[] = [testedMovie];
    appState.watchList.next(initialWatchList);

    const watchListNextSpy = spyOn(appState.watchList, 'next').and.callThrough();
    appState.removeFromWatchList(testedMovie);

    expect(watchListNextSpy).toHaveBeenCalledWith([]);
});

it('should not modify the watch list if the movie to remove does not exist', () => {
    const nonExistingMovie: SearchDetail = { Poster: 'nonExistingPoster',Title: 'nonExistingTitle',
    Type: 'nonExistingType', Year: '2000',imdbID: 'nonExistingId',isWatched: false,isAdded: false
    };

    const initialWatchList: SearchDetail[] = [];
    appState.watchList.next(initialWatchList);

    const watchListNextSpy = spyOn(appState.watchList, 'next').and.callThrough();
    appState.removeFromWatchList(nonExistingMovie);

    expect(watchListNextSpy).not.toHaveBeenCalled();
});

it('should remove a movie from the watch list if it exists, leaving other movies', () => {
    const movieToRemove: SearchDetail = { Poster: 'removePoster',Title: 'removeTitle',Type: 'removeType',
        Year: '2000',imdbID: 'removeId',isWatched: false,isAdded: false
    };

    const existingMovies: SearchDetail[] = [testedMovie,movieToRemove,{  Poster: 'nonExistingPoster',Title: 'nonExistingTitle',
    Type: 'nonExistingType',Year: '2000',imdbID: 'nonExistingId',isWatched: false,isAdded: false }
    ];

    appState.watchList.next(existingMovies);
    const watchListNextSpy = spyOn(appState.watchList, 'next').and.callThrough();

    appState.removeFromWatchList(movieToRemove);

    expect(watchListNextSpy).toHaveBeenCalledWith(existingMovies.filter(movie => movie.imdbID !== movieToRemove.imdbID));
});

it('should update the "isWatched" property of a movie in the watch list if it exists', () => {
    const initialWatchList: SearchDetail[] = [testedMovie];
    appState.watchList.next(initialWatchList);

    const watchListNextSpy = spyOn(appState.watchList, 'next').and.callThrough();

    appState.updateMovieFromWatchList(testedMovie);
    expect(watchListNextSpy).toHaveBeenCalledWith([{ ...testedMovie, isWatched: true }]);
});

it('should not modify the watch list if the movie to update does not exist', () => {
    const nonExistingMovie: SearchDetail = { Poster: 'nonExistingPoster',Title: 'nonExistingTitle',Type: 'nonExistingType',Year: '2000',
    imdbID: 'nonExistingId',isWatched: false,isAdded: false};

    const initialWatchList: SearchDetail[] = [];
    appState.watchList.next(initialWatchList);

    const watchListNextSpy = spyOn(appState.watchList, 'next').and.callThrough();

    appState.updateMovieFromWatchList(nonExistingMovie);

    expect(watchListNextSpy).not.toHaveBeenCalled();
});

it('should update the "isWatched" property of a movie in the watch list, leaving other movies unchanged', () => {
    const movieToUpdate: SearchDetail = { 
        Poster: 'updatePoster',
        Title: 'updateTitle',
        Type: 'updateType',
        Year: '2000',
        imdbID: 'updateId',
        isWatched: false,
        isAdded: false
    };

    const existingMovies: SearchDetail[] = [
       testedMovie,
        movieToUpdate,
        { Poster: 'nonExistingPoster',Title: 'nonExistingTitle',Type: 'nonExistingType',Year: '2000',
        imdbID: 'nonExistingId',isWatched: false,isAdded: false}]
        
    appState.watchList.next(existingMovies);
    const watchListNextSpy = spyOn(appState.watchList, 'next').and.callThrough();

    appState.updateMovieFromWatchList(movieToUpdate);

    expect(watchListNextSpy).toHaveBeenCalledWith([
        existingMovies[0],
        { ...movieToUpdate, isWatched: true },
        existingMovies[2],
    ]);
});
});

