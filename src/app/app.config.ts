import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from "@angular/common/http";
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { appReducer } from './api/store/app.reducer';
import { AppEffects } from './api/store/app.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(),
    importProvidersFrom(
    StoreModule.forFeature('app', appReducer),
    EffectsModule.forRoot([]),
    StoreModule.forRoot({}), 
    EffectsModule.forFeature([AppEffects])), 
    provideStoreDevtools({
       maxAge: 25,
       logOnly: !isDevMode(),
       autoPause: true,
       trace: false,
       traceLimit: 75,
       connectInZone: true,

    })
  ]
};
