export interface Company {
  name: string;
  cases: Case[];
}

export interface Case {
  title: string;
  url: string;
  description?: string;
}

export interface SearchResult {
  companyName: string;
  cases: Case[];
}
