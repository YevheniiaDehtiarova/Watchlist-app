import { SearchDetail } from './search-detail';
import { Injectable } from '@angular/core';
import { Title } from './title';

@Injectable({providedIn: 'root'})

export class TypeMapper{

    constructor(){ }

    mapTitleToWatchList(title: Title): SearchDetail{
      const detailTitle = {
        Poster: title.Poster,
        Title: title.Title,
        Type: title.Type,
        Year: title.Year,
        imdbID: title.imdbID
      }
      return detailTitle;
    }
  }

