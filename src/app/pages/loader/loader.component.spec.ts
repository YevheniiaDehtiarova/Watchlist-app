import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderComponent } from './loader.component';
import { Store, StoreModule } from '@ngrx/store';
import { appReducer } from '../../api/store/app.reducer';

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaderComponent,StoreModule.forRoot( appReducer )]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.inject(Store);  
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
