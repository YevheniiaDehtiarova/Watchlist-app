import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { appReducer } from './app.reducer';
import { AppEffects } from './app.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';


@NgModule({
  imports: [
    StoreModule.forFeature('app', appReducer), 
    EffectsModule.forFeature([AppEffects]),
    StoreDevtoolsModule.instrument(),
  ]
})
export class AppFeatureModule {}
