import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchListComponent } from './watch-list.component';
import { SearchDetail } from '../../api/types/search-detail';
import { AppState } from '../../app.state';
import { of } from 'rxjs';

describe('WatchListComponent', () => {
  let component: WatchListComponent;
  let fixture: ComponentFixture<WatchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WatchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});