import { TestBed } from '@angular/core/testing';
import { SearchDetail } from '../api/types/search-detail';
import { AppLocalState } from './app.local.state';

describe('AppLocalState', () => {
  let appLocalState: AppLocalState;
  let mockWatchListWithMovie: Array<SearchDetail>;
  let mockWatchListWithMovies: Array<SearchDetail>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppLocalState]
    });

    appLocalState = TestBed.inject(AppLocalState);
    mockWatchListWithMovie = [{ Poster: 'dvsd',Title: 'svzsg',Type: 'dvdsvsdb',Year: '2000',imdbID: '1',isWatched: false,isAdded: false}]
    mockWatchListWithMovies = [{ Poster: 'dvsd',Title: 'svzsg',Type: 'dvdsvsdb',Year: '2000',imdbID: '2',isWatched: false,isAdded: false}]
  });

  it('should be created', () => {
    expect(appLocalState).toBeTruthy();
  });

  describe('getWatchListFromLocalStorage', () => {
    it('should return an empty array if localStorage is empty', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      const result = appLocalState.getWatchListFromLocalStorage();
      expect(result).toEqual([]);
    });

    it('should return an array of SearchDetail from localStorage', () => {
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockWatchListWithMovie));
      const result = appLocalState.getWatchListFromLocalStorage();
      expect(result).toEqual(mockWatchListWithMovie);
    });
  });

  describe('updateWatchListLocalStorage', () => {
    it('should update localStorage with the provided watchList', () => {
      spyOn(localStorage, 'setItem');
      appLocalState.updateWatchListLocalStorage(mockWatchListWithMovie);
      expect(localStorage.setItem).toHaveBeenCalledWith('watchList', JSON.stringify(mockWatchListWithMovie));
    });
  });

  describe('removeWatchListFromLocalStorage', () => {
    it('should remove the movie from watchList and update localStorage', () => {
      const mockMovieToRemove: SearchDetail = { Poster: 'dvsd',Title: 'svzsg',Type: 'dvdsvsdb',Year: '2000',imdbID: '1',isWatched: false,isAdded: false} 
      appLocalState.removeWatchListFromLocalStorage(mockMovieToRemove, mockWatchListWithMovies);

    });

    it('should not update localStorage if movie is not found in watchList', () => {
     const mockMovieToRemove: SearchDetail ={ Poster: 'dvsd',Title: 'svzsg',Type: 'dvdsvsdb',Year: '2000',imdbID: '1',isWatched: false,isAdded: false} 

      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockWatchListWithMovies));
      spyOn(localStorage, 'setItem');
      appLocalState.removeWatchListFromLocalStorage(mockMovieToRemove, mockWatchListWithMovies);

      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });
})

