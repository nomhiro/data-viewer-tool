export interface Classification {
  name: string; // 分類名（例: "カテゴリA"）
  pages: {
    pageNumber: number; // ページ番号
    saveAsImage: boolean; // 画像として保存するかどうかのフラグ
  }[]; // ページ番号と保存フラグのリスト
  text: string; // 分類に関連付けられたテキスト内容
}
