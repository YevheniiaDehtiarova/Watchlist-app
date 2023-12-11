import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-base',
  template: '',
})
export class BaseComponent implements OnDestroy { 
  public destroy$ = new Subject<void>();
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  } 
}