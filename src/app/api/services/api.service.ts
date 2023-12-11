import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Title } from "../types/title";
import { SearchResult } from "../types/search-result";
import { Observable } from 'rxjs';

const API_KEY = 'd7f05bec'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  readonly url = `http://www.omdbapi.com/?apikey=${ API_KEY }`;

  constructor(private http: HttpClient) { }

  public search(search: string):Observable<SearchResult> {
    console.log(search, 'search from service')
    return this.http.get<SearchResult>(this.url, { params: { s: search }})
  }

  public getByTitle(title: string):Observable<Title> {
    const params = { i: title, apikey: API_KEY };
    let url = `http://www.omdbapi.com/`;
    url = `${url}?${this.buildQueryString(params)}`;
    console.log(url, 'URL from service');

    return this.http.get<Title>(url);
  
  }

    private buildQueryString(params: { [key: string]: any }): string {
       const sortedKeys = Object.keys(params).sort();
       return sortedKeys
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
      .join('&');
}

}
