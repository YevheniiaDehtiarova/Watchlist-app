import { Component } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { selectLoading } from '../../api/store/app.selector';
import { Store } from '@ngrx/store';
import { AppState } from '../../api/store/app.state';


@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [NgIf, AsyncPipe],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent  {
  loading$: Observable<boolean> = this.store.select(selectLoading);
  constructor(private store:  Store<AppState>){}
}
