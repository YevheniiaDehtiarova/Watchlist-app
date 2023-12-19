

import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { mergeMap, map, catchError, withLatestFrom, filter, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as appActions from './app.actions';
import { ApiService } from '../services/api.service';

@Injectable()
export class AppEffects {
  constructor(private actions$: Actions, private apiService: ApiService) {}

  fetchCurrentTitle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.fetchCurrentTitle),
      mergeMap(({ id }) =>
        this.apiService.getByTitle(id).pipe(
          map((currentTitle) => {
            console.log('effect works');
            console.log(currentTitle, 'currenttitle')
            return appActions.fetchCurrentTitleSuccess({ currentTitle })}
            ),
          catchError(() => of({ type: 'Error Occurred' }))  // add failure action to fecth CT
        )
      )
    )
  );

  searchByTitle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.searchByTitle),
      mergeMap((action) =>
        this.apiService.search(action.title).pipe(
          map((movies) => {
             console.log(movies, 'movies from search by title')
            return appActions.searchSuccess({ movies })
          }),
          catchError((error) => of(appActions.searchFailure({ error })))
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
