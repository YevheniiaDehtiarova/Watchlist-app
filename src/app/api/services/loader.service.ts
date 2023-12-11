import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loading: boolean = false;

  constructor() { }

  setLoading(loading: boolean) {
    console.log('set loading works')
    this.loading = loading;
  }

  getLoading(): boolean {
    console.log('get loading works')
    return this.loading;
  }
}