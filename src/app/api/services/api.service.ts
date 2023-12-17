import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Title } from "../types/title";
import { SearchResult } from "../types/search-result";
import { Observable, map } from 'rxjs';

const API_KEY = 'd7f05bec'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  readonly url = `http://www.omdbapi.com/?apikey=${API_KEY}`;

  constructor(private http: HttpClient) { }

  public search(search: string): Observable<SearchResult> {
    return this.http.get<SearchResult>(this.url, { params: { s: search } })
  }

  public getSuggestions(searchTerm: string): Observable<string[]> {
    return this.http.get<SearchResult>(this.url, { params: { s: searchTerm } })
      .pipe(
        map(response => (response.Search).map(item => item.Title))
      );
  }

  public getByTitle(title: string): Observable<Title> {
    const params = { i: title, apikey: API_KEY };
    let url = `http://www.omdbapi.com/`;
    url = `${url}?${this.buildQueryString(params)}`;

    return this.http.get<Title>(url);

  }

  private buildQueryString(params: { [key: string]: any }): string {
    const sortedKeys = Object.keys(params).sort();
    return sortedKeys
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
      .join('&');
  }

}
