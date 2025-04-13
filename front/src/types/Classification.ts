export interface Classification {
  category: string;
  pages: {
    pageNumber: number; // ページ番号
    saveAsImage: boolean; // 画像として保存するかどうかのフラグ
  }[]; // ページ番号と保存フラグのリスト
  content: string; // 分類に関連付けられたテキスト内容
}
