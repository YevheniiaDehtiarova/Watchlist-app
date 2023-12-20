import { appReducer, initialState } from './app.reducer';
import * as appActions from './app.actions';
import { AppState } from './app.state';
import { Title } from '../types/title';


describe('App Reducer', () => {
  let title: Title = {
    Title: 'abc', Year: 'abc', Rated: 'abc', Released: 'abc', Runtime: 'abc', Genre: 'abc', Director: 'abc', Writer: 'abc',
    Actors: 'abc', Plot: 'abc', Language: 'abc', Country: 'abc', Awards: 'abc', Poster: 'abc', Ratings: [{
      Source: 'abc', Value: 'abc'
    }], Metascore: 'abc', imdbRating: 'abc', imdbVotes: 'abc', imdbID: 'abc', Type: 'abc', totalSeasons: 'abc', Response: 'True', Error: 'abc', isAdded: false
  };
  it('should return the initial state', () => {
    const action = {} as any;
    const state = appReducer(initialState, action);

    expect(state).toBe(initialState);
  });

  it('should handle fetchCurrentTitleSuccess action when not added to list/watchList', () => {
    const action = appActions.fetchCurrentTitleSuccess({ currentTitle: title as any });
    const state = appReducer(initialState, action);

    expect(state.loading).toBe(false);

    expect(state.currentTitle).toEqual(title as any);
  });

  it('should handle fetchCurrentTitleSuccess action when added to list/watchList', () => {
    const action = appActions.fetchCurrentTitleSuccess({ currentTitle: title });
    const state = appReducer(initialState, action);

    expect(state.loading).toBe(false);

    expect(state.currentTitle).toEqual({ ...title, isAdded: false });
  });

  it('should handle fetchCurrentTitleFailure action', () => {
    const action = appActions.fetchCurrentTitleFailure({ error: 'error' });
    const state = appReducer(initialState, action);

    expect(state.loading).toBe(false);
  });

  it('should handle updateCurrentTitle action', () => {

    const updatedIsAdded = true;

    const action = appActions.updateCurrentTitle({ currentTitle: title, isAdded: updatedIsAdded });
    const state = appReducer(initialState, action);

    expect(state.currentTitle?.isAdded).toBe(updatedIsAdded);
  });

  it('should handle addToWatchList action when movie does not exist in watchList', () => {
    const newMovie = {
      Poster: 'dvsd', Title: 'svzsg', Type: 'dvdsvsdb',
      Year: '2000', imdbID: '1', isWatched: false, isAdded: false
    }

    const action = appActions.addToWatchList({ movie: newMovie });
    const state = appReducer(initialState, action);

    expect(state.watchList).toEqual([newMovie]);
  });

  it('should handle addToWatchList action when movie already exists in watchList', () => {
    const existingMovie = initialState.watchList[0];
    const action = appActions.addToWatchList({ movie: existingMovie });
    const state = appReducer(initialState, action);
    expect(state.watchList).toEqual(initialState.watchList);
  });

  it('should handle removeFromWatchList action', () => {
    const initialWatchList = [
      { Poster: 'dvsd', Title: 'svzsg', Type: 'dvdsvsdb', Year: '2000', imdbID: '1', isWatched: false, isAdded: false },
      { Poster: 'dvsd', Title: 'svzsg', Type: 'dvdsvsdb', Year: '2000', imdbID: '2', isWatched: false, isAdded: false },
      { Poster: 'dvsd', Title: 'svzsg', Type: 'dvdsvsdb', Year: '2000', imdbID: '3', isWatched: false, isAdded: false },
    ];

    const movieToRemove = initialWatchList[1];

    const action = appActions.removeFromWatchList({ movie: movieToRemove });
    const state = appReducer(initialState, action);

    expect(state.watchList).toEqual([initialWatchList[0], initialWatchList[2]]);
  });

  it('should handle removeFromWatchList action when movie is not in watchList', () => {
    const movieNotInWatchList = { Poster: 'dvsd', Title: 'svzsg', Type: 'dvdsvsdb', Year: '2000', imdbID: '4', isWatched: false, isAdded: false };

    const action = appActions.removeFromWatchList({ movie: movieNotInWatchList });
    const state = appReducer(initialState, action);

    expect(state.watchList).toEqual(initialState.watchList);
  });

  it('should handle updateMovieFromWatchList action when movie is in watchList', () => {
    const initialWatchList = [
      { Poster: 'dvsd', Title: 'svzsg', Type: 'dvdsvsdb', Year: '2000', imdbID: '1', isWatched: false, isAdded: false },
      { Poster: 'dvsd', Title: 'svzsg', Type: 'dvdsvsdb', Year: '2000', imdbID: '2', isWatched: false, isAdded: false },
      { Poster: 'dvsd', Title: 'svzsg', Type: 'dvdsvsdb', Year: '2000', imdbID: '3', isWatched: false, isAdded: false },
    ];

    const movieToUpdate = initialWatchList[1];

    const action = appActions.updateMovieFromWatchList({ movie: movieToUpdate });
    const state = appReducer(initialState, action);

    expect(state.watchList).toEqual([
      initialWatchList[0],
      { ...initialWatchList[1], isWatched: true },
      initialWatchList[2],
    ]);
  });

  it('should handle updateMovieFromWatchList action when movie is not in watchList', () => {
    const movieNotInWatchList = { Poster: 'dvsd', Title: 'svzsg', Type: 'dvdsvsdb', Year: '2000', imdbID: '4', isWatched: false, isAdded: false };

    const action = appActions.updateMovieFromWatchList({ movie: movieNotInWatchList });
    const state = appReducer(initialState, action);

    expect(state.watchList).toEqual(initialState.watchList);
  });

  it('should set loading to true on searchByTitle', () => {
    const action = appActions.searchByTitle({ title: 'Your Search Term' });
    const state = appReducer(initialState, action);

    expect(state.loading).toBe(true);
  });

  it('should update state on searchSuccess', () => {
    const movies = { Response: 'False', Search: [{ Poster: 'dvsd', Title: 'svzsg', Type: 'dvdsvsdb', Year: '2000', imdbID: '1', isWatched: false, isAdded: false }], totalResults: 'True' };
    const action = appActions.searchSuccess({ movies });
    const state = appReducer(initialState, action);

    expect(state.searchResults).toEqual(movies);
    expect(state.searchError).toBeNull();
    expect(state.loading).toBe(false);
  });

  it('should update state on searchFailure', () => {
    const error = 'Too many results';
    const action = appActions.searchFailure({ error });
    const state = appReducer(initialState, action);

    expect(state.searchResults).toBeNull();
    expect(state.searchError).toEqual(error);
    expect(state.loading).toBe(false);
  });

  it('should update state on updateSearchMovie', () => {
    const initialStateWithMovie = {
      ...initialState,
      searchResults: {
        Search: [{ Poster: 'dvsd', Title: 'svzsg', Type: 'dvdsvsdb', Year: '2000', imdbID: '1', isWatched: false, isAdded: false }]
      },
    };

    const movieToUpdate = { Poster: 'dvsd', Title: 'svzsg', Type: 'dvdsvsdb', Year: '2000', imdbID: '1', isWatched: false, isAdded: false }
    const action = appActions.updateSearchMovie({ movie: movieToUpdate });
    const state = appReducer(initialState, action);

    const expectedUpdatedSearchResults = initialStateWithMovie.searchResults.Search.map((item) =>
      item.imdbID === movieToUpdate.imdbID ? { ...item, isAdded: true } : item
    );

    expect(state.searchResults?.Search).toEqual(expectedUpdatedSearchResults);
  });

  it('should update state on loadSuggestionsSuccess', () => {
    const suggestions = ['string1', 'string2']
    const action = appActions.loadSuggestionsSuccess({ suggestions });
    const state = appReducer(initialState, action);

    expect(state.suggestions).toEqual(suggestions);
  });

  it('should reset state to initial on loadSuggestionsFailure', () => {
    const action = appActions.loadSuggestionsFailure(({ error: 'any' }));
    const state = appReducer(initialState, action);

    expect(state).toEqual(initialState);
  });

});


