
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { mergeMap, map, catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as appActions from './app.actions';
import { ApiService } from '../services/api.service';


@Injectable()
export class AppEffects {
  constructor(private actions$: Actions, private apiService: ApiService) { }

  fetchCurrentTitle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.fetchCurrentTitle),
      tap(() => {
        appActions.setLoadingTrue
      }),
      mergeMap(({ id }) =>
        this.apiService.getByTitle(id).pipe(
          map((currentTitle) => {
           appActions.setLoadingFalse
            if (currentTitle.Error) { 
              appActions.setLoadingFalse
             }
            return appActions.fetchCurrentTitleSuccess({ currentTitle })
          }
          ),
          catchError((currentTitle) => {
            appActions.setLoadingFalse
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
        appActions.setLoadingTrue
      }),
      mergeMap((action) =>
        this.apiService.search(action.title).pipe(
          map((movies) => {
            if (movies.Error) {
              of(appActions.searchFailure({ error: movies.Error }))
            }
            appActions.setLoadingFalse
            return appActions.searchSuccess({ movies })
          }),
          catchError((movies) => {
            appActions.setLoadingFalse
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
          map((suggestions) => {
            return appActions.loadSuggestionsSuccess({ suggestions })
          }),
          catchError((error) => of(appActions.loadSuggestionsFailure({ error })))
        )
      )
    ));


    searchWithSuggestions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.searchWithSuggestions),
      mergeMap((action) =>
        this.apiService.searchWithSuggestions(action.search).pipe(
          map(({ results, suggestions }) => {
            return appActions.searchWithSuggestionsSuccess({ results, suggestions });
          }),
          catchError((error) => of(appActions.searchWithSuggestionsFailure({ error })))
        )
      )
    )
  );
}
