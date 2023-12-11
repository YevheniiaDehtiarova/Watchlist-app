import { SearchDetail } from "./search-detail";

export type SearchResult = {
  Response: string;
  Error?: string,
  Search: Array<SearchDetail>
  totalResults: string,
}
