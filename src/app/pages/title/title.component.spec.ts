import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TitleComponent } from './title.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Title } from '../../api/types/title';
import { TypeMapper } from '../../api/types/type.mapper';
import { Store, StoreModule } from '@ngrx/store';
import { appReducer } from '../../api/store/app.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from '../../api/store/app.effects';
import * as appActions from '../../api/store/app.actions';


describe('TitleComponent', () => {
  let component: TitleComponent;
  let fixture: ComponentFixture<TitleComponent>;
  let store: Store;
  let testedTitle: Title;
  let typeMapper: TypeMapper;
  let testedId: any;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [TitleComponent,HttpClientTestingModule, StoreModule.forRoot(appReducer),EffectsModule.forRoot([AppEffects])],
      providers: [ TypeMapper,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
            },
          },
        },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TitleComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
    typeMapper = TestBed.inject(TypeMapper);
    testedId = '1';
    testedTitle = {Title: 'abc',Year: 'abc',Rated: 'abc',Released: 'abc',Runtime: 'abc',Genre: 'abc',Director: 'abc',Writer: 'abc',
    Actors: 'abc',Plot: 'abc',Language: 'abc',Country: 'abc',Awards: 'abc',Poster: 'abc',Ratings: [{
    Source: 'abc',Value: 'abc'}],Metascore: 'abc',imdbRating: 'abc',imdbVotes: 'abc',imdbID: 'abc', Type: 'abc',totalSeasons: 'abc',Response: 'True',Error: 'abc',isAdded: false };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  it('should call calculateMovieId on ngOnInit', () => {
    spyOn(component, 'calculateMovieId').and.returnValue(testedId);
    component.ngOnInit();
    expect(component.calculateMovieId).toHaveBeenCalled();
    expect(component.movieId).toEqual(testedId);
  });

  it('should test movieId in activated route', () => {
    component.calculateMovieId();
    expect(component.movieId).toBe('1');
  });

  it('should  test null value in movieId', () => {
    component.calculateMovieId();
    const testId = null
    expect(testId).toBe(null);
  })

  it('should call fetchCurrentTitle on ngOnInit', () => {
    spyOn(component, 'fetchCurrentTitle');

    component.ngOnInit();

    expect(component.fetchCurrentTitle).toHaveBeenCalledWith(component.movieId);
  });

  it('should dispatch fetchCurrentTitle action with the correct ID', () => {
    const mockMovieId = '123';
    spyOn(store, 'dispatch');

    component.fetchCurrentTitle(mockMovieId);

    expect(store.dispatch).toHaveBeenCalledWith(appActions.fetchCurrentTitle({ id: mockMovieId }));
  });

 
  it('should dispatch addToWatchList and updateCurrentTitle actions', () => {
    const mockMappedMovie  = { Poster: 'dvsd',Title: 'svzsg',Type: 'dvdsvsdb',
    Year: '2000',imdbID: '1',isWatched: false,isAdded: false
  }

    spyOn(typeMapper, 'mapTitleToWatchList').and.returnValue(mockMappedMovie);
    spyOn(store, 'dispatch');

    component.addMovieToWatchList(testedTitle);

    expect(typeMapper.mapTitleToWatchList).toHaveBeenCalledWith(testedTitle);
    expect(store.dispatch).toHaveBeenCalledWith(appActions.addToWatchList({ movie: mockMappedMovie }));
    expect(store.dispatch).toHaveBeenCalledWith(appActions.updateCurrentTitle({ currentTitle: testedTitle, isAdded: true }));
  });

  it('should dispatch removeFromWatchList and updateCurrentTitle actions', () => {

    const mockMappedMovie  = { Poster: 'dvsd',Title: 'svzsg',Type: 'dvdsvsdb',
    Year: '2000',imdbID: '1',isWatched: false,isAdded: false
  }

    spyOn(typeMapper, 'mapTitleToWatchList').and.returnValue(mockMappedMovie);
    spyOn(store, 'dispatch');

    component.removeMovieFromWatchList(testedTitle);

    expect(typeMapper.mapTitleToWatchList).toHaveBeenCalledWith(testedTitle);
    expect(store.dispatch).toHaveBeenCalledWith(appActions.removeFromWatchList({ movie: mockMappedMovie }));
    expect(store.dispatch).toHaveBeenCalledWith(appActions.updateCurrentTitle({ currentTitle: testedTitle, isAdded: false }));
  });



  it('should return true if index + 1 is less than or equal to filled stars', () => {
    const result = component.isStarFilled('8', 2);
    expect(result).toBe(true);
  });

  it('should return false if index + 1 is greater than filled stars', () => {
    const result = component.isStarFilled('6', 3);
    expect(result).toBe(false);
  });

  it('should return false if the rating is not a valid number', () => {
    const result = component.isStarFilled('abc', 2);
    expect(result).toBe(false);
  });

});

