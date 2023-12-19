
import { SearchDetail } from "../types/search-detail";
import { SearchResult } from "../types/search-result";
import { Title } from "../types/title";

export interface AppState {
    currentTitle: Title | null;
    watchList: SearchDetail[];
    searchResults: SearchResult | null;
    searchError: any;
    suggestions: Array<string>;
    loading: boolean;
  }

