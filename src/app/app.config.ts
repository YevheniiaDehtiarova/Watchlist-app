import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from "@angular/common/http";
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { appReducer } from './api/store/app.reducer';
import { AppEffects } from './api/store/app.effects';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(),
    importProvidersFrom(
    StoreModule.forFeature('app', appReducer),
    EffectsModule.forRoot([]),
    StoreModule.forRoot({}), 
    EffectsModule.forFeature([AppEffects])), 
  ]
};
