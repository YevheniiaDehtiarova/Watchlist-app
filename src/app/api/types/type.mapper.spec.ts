import { TestBed } from '@angular/core/testing';
import { Title } from './title';
import { SearchDetail } from './search-detail';
import { TypeMapper } from './type.mapper';

describe('TypeMapper', () => {
  let typeMapper: TypeMapper;
  let testedTitle: Title;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TypeMapper],
    });

    typeMapper = TestBed.inject(TypeMapper);
    testedTitle = {Title: 'abc',Year: 'abc',Rated: 'abc',Released: 'abc',Runtime: 'abc',Genre: 'abc',Director: 'abc',Writer: 'abc',
    Actors: 'abc',Plot: 'abc',Language: 'abc',Country: 'abc',Awards: 'abc',Poster: 'abc',Ratings: [{
    Source: 'abc',Value: 'abc'}],Metascore: 'abc',imdbRating: 'abc',imdbVotes: 'abc',imdbID: 'abc', Type: 'abc',totalSeasons: 'abc',Response: 'True',Error: 'abc',isAdded: false, };
  });

  it('should map a Title object to a SearchDetail object', () => {
    const result: SearchDetail = typeMapper.mapTitleToWatchList(testedTitle);

    const expectedSearchDetail: SearchDetail = {
      Poster: 'abc',
      Title: 'abc',
      Type: 'abc',
      Year: 'abc',
      imdbID: 'abc',
    };
    expect(result).toEqual(expectedSearchDetail);
  });
});
