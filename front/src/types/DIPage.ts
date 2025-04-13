export interface Page {
  pageNumber: number; // キャメルケースに変更
  width: number;
  height: number;
  lines: Array<Record<string, any>>;
  tables?: Array<Record<string, any>>;
  figures?: Array<Record<string, any>>;
}
