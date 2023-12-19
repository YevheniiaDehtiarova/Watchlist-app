

import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { mergeMap, map, catchError, withLatestFrom, filter, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as appActions from './app.actions';
import { ApiService } from '../services/api.service';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class AppEffects {
  constructor(private actions$: Actions, private apiService: ApiService,
             private loaderService: LoaderService) {}

  fetchCurrentTitle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.fetchCurrentTitle),
      tap(() => {
        this.loaderService.setLoading(true);
      }),
      mergeMap(({ id }) =>
        this.apiService.getByTitle(id).pipe(
          map((currentTitle) => {
            console.log('effect works');
            console.log(currentTitle, 'currenttitle');
            this.loaderService.setLoading(false);
            if(currentTitle.Error){ this.loaderService.setLoading(false)}
            return appActions.fetchCurrentTitleSuccess({ currentTitle })}
            ),
          catchError((currentTitle) =>{
            this.loaderService.setLoading(false);
            return of(appActions.fetchCurrentTitleFailure({ error: currentTitle.Error }));
           })  
        )
      )
    )
  );

  searchByTitle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.searchByTitle),
      tap(() => {
        this.loaderService.setLoading(true);
      }),
      mergeMap((action) =>
        this.apiService.search(action.title).pipe(
          map((movies) => {
            if (movies.Error) {
              of(appActions.searchFailure({ error: movies.Error }))
            }
             console.log(movies, 'movies from search by title');
             this.loaderService.setLoading(false);
            return appActions.searchSuccess({ movies })
          }),
          catchError((movies) => {
            this.loaderService.setLoading(false);
            return of(appActions.searchFailure({ error: movies.Error }))
          })
        )
      )
    )
  );

  loadSuggestions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.loadSuggestions),
      switchMap((action) =>
        this.apiService.getSuggestions(action.searchTerm).pipe(
          map((suggestions) =>{
            console.log(suggestions)
            return appActions.loadSuggestionsSuccess({ suggestions })
          }),
          catchError((error) => of(appActions.loadSuggestionsFailure({ error })))
        )
      )
    ));
}
