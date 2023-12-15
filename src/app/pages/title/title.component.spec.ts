import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TitleComponent } from './title.component';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../api/services/api.service';
import { AppState } from '../../state/app.state';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoaderService } from '../../api/services/loader.service';
import { of, throwError } from 'rxjs';
import { Title } from '../../api/types/title';
import { TypeMapper } from '../../api/types/type.mapper';


describe('TitleComponent', () => {
  let component: TitleComponent;
  let fixture: ComponentFixture<TitleComponent>;
  let appState: AppState;
  let apiService: ApiService;
  let http: HttpClient;
  let appStateMock: jasmine.SpyObj<AppState>;
  let loaderServiceMock: jasmine.SpyObj<LoaderService>;
  let testedTitle: Title;
  let typeMapper: TypeMapper;
  let testedId: any;

  beforeEach(async () => {
    appStateMock = jasmine.createSpyObj('AppState', ['fetchCurrentTitle', 'addToWatchList']);
    loaderServiceMock = jasmine.createSpyObj('LoaderService', ['setLoading', 'getLoading']);
    await TestBed.configureTestingModule({
      imports: [TitleComponent,HttpClientTestingModule],
      providers: [AppState, ApiService, TypeMapper,
        { provide: LoaderService, useValue: loaderServiceMock },
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
    fixture.detectChanges();
    appState = new AppState(apiService);
    apiService = new ApiService(http);
    typeMapper = TestBed.inject(TypeMapper);
    testedId = 1;
    testedTitle = {Title: 'abc',Year: 'abc',Rated: 'abc',Released: 'abc',Runtime: 'abc',Genre: 'abc',Director: 'abc',Writer: 'abc',
    Actors: 'abc',Plot: 'abc',Language: 'abc',Country: 'abc',Awards: 'abc',Poster: 'abc',Ratings: [{
    Source: 'abc',Value: 'abc'}],Metascore: 'abc',imdbRating: 'abc',imdbVotes: 'abc',imdbID: 'abc', Type: 'abc',totalSeasons: 'abc',Response: 'True',Error: 'abc',isAdded: false };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadMovieTitle on ngOnInit', () => {
    spyOn(component, 'loadMovieTitle');
    component.ngOnInit();
    expect(component.loadMovieTitle).toHaveBeenCalled();
  });

  it('should call calculateMovieId on ngOnInit', () => {
    spyOn(component, 'calculateMovieId');
    component.ngOnInit();
    expect(component.calculateMovieId).toHaveBeenCalled();
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


  it('should load movie title successfully', fakeAsync(() => {
    appStateMock.fetchCurrentTitle.and.returnValue(of(testedTitle));

    component.loadMovieTitle();

    expect(loaderServiceMock.setLoading).toHaveBeenCalledWith(true);
    expect(component.loading).toBe(true);

    component.store.fetchCurrentTitle(testedId)

    tick();
    fixture.detectChanges();

    expect(component.title).toBeUndefined();
  }));

  it('should handle error while loading movie title', () => {
    const mockError = new Error('Test error');

    appStateMock.fetchCurrentTitle.and.returnValue(throwError(mockError));

    component.loadMovieTitle();

    expect(loaderServiceMock.setLoading).toHaveBeenCalledWith(true);
    expect(component.loading).toBe(true);

    fixture.detectChanges();
  });


    it('should test add movie to wath list', () => {
      component.addMovieToWatchList(testedTitle);
      expect(testedTitle.isAdded).toBe(true);
      spyOn(appState, 'addToWatchList');
    })

  it('should remove a movie from watch list and update local storage', () => {
    spyOn(typeMapper, 'mapTitleToWatchList').and.returnValue(testedTitle);
    spyOn(appState, 'removeFromWatchList');

    component.removeMovieFromWatchList(testedTitle);

    expect(typeMapper.mapTitleToWatchList).toHaveBeenCalledWith(testedTitle);
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

  it('should set isExistMovieWatchList to true if the movie is found in the watch list', () => {

    component.checkExistMovieWatchList(testedTitle);
    expect(component.isExistMovieWatchList).toBe(false);
  });

});

