import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SearchResult } from '../types/search-result';
import { Title } from '../types/title';


describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const API_KEY = 'd7f05bec'


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should search for movies', () => {
    const searchQuery = 'The Avengers';

    const mockSearchResult: SearchResult = { Response: 'True', Search: [{ Poster: 'dvsd',
    Title: 'svzsg',Type: 'dvdsvsdb',Year: '2000', imdbID: '1',isWatched: false,isAdded: false
  }],  totalResults: 'True'}
    
    service.search(searchQuery).subscribe((result) => {
      expect(result).toEqual(mockSearchResult);
    });

    const req = httpMock.expectOne((request) => request.url === service.url && request.params.get('s') === searchQuery);
    expect(req.request.method).toBe('GET');

    req.flush(mockSearchResult);
  });

  it('should return suggestions for a given search term', () => {
    const searchTerm = 'test';
    const mockResponse = {
      Search: [
        { Title: 'Test Movie 1' },
        { Title: 'Test Movie 2' },
      ],
    };

     service.getSuggestions(searchTerm).subscribe((suggestions) => {
      expect(suggestions).toEqual(['Test Movie 1', 'Test Movie 2']);
    });
    const req = httpMock.expectOne((request) => request.url === service.url);

    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('s')).toBe(searchTerm);

    req.flush(mockResponse);
  })

  it('should handle empty search results', () => {
    const searchTerm = 'test';
    const emptyResponse: SearchResult = {
      Search: [], Response: 'True', Error: 'abc', totalResults: 'abc'
    };

    service.getSuggestions(searchTerm).subscribe((suggestions) => {
      expect(suggestions).toEqual([]);
    });

    const req = httpMock.expectOne((request) => request.url.includes(service.url));
    expect(req.request.method).toEqual('GET');
    req.flush(emptyResponse);
  });

  it('should get a movie by title', () => {
    const title = 'The Matrix';
    const mockTitle: Title = {Title: 'abc',Year: 'abc',Rated: 'abc',Released: 'abc',Runtime: 'abc',Genre: 'abc',Director: 'abc',Writer: 'abc',
    Actors: 'abc',Plot: 'abc',Language: 'abc',Country: 'abc',Awards: 'abc',Poster: 'abc',Ratings: [{
    Source: 'abc',Value: 'abc'}],Metascore: 'abc',imdbRating: 'abc',imdbVotes: 'abc',imdbID: 'abc', Type: 'abc',totalSeasons: 'abc',Response: 'True',Error: 'abc',isAdded: false, };

    service.getByTitle(title).subscribe((result) => {
      expect(result).toEqual(mockTitle);
    });

    const expectedUrl = `http://www.omdbapi.com/?apikey=${API_KEY}&i=${encodeURIComponent(title)}`;
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');

    req.flush(mockTitle);
  });

  it('should return an empty array for a non-existing search term', () => {
    const searchTerm = 'nonexistent';
    const mockResponse = {
      Search: [], 
    };

    service.getSuggestions(searchTerm).subscribe((suggestions) => {
      expect(suggestions).toEqual([]);
    });

    const req = httpMock.expectOne((request) => request.url === service.url);

    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('s')).toBe(searchTerm);

    req.flush(mockResponse);
  });


  it('should build a query string from parameters', () => {
    const params = {
      title: 'The Matrix',
      year: 1999,
      genre: 'Sci-Fi',
    };

    const queryString = service['buildQueryString'](params); 
    const expectedQueryString = 'genre=Sci-Fi&title=The%20Matrix&year=1999';

    expect(queryString).toEqual(expectedQueryString);
  });
})

