import { NextResponse } from "next/server";
import { Classification } from "@/types/Classification";

/**
 * OCR結果を生成するAPIエンドポイント
 * 
 * @param {Request} request - クライアントからのリクエスト
 * @returns {NextResponse} OCR結果を含むJSONレスポンス
 */
export async function POST(request: Request) {
  // リクエストボディからページ数を取得
  const { pageCount } = await request.json();

  /**
   * 仮のOCR結果を生成
   * - 各分類には名前、関連するページ、OCRテキストが含まれる
   */
  const classifications: Classification[] = [
    {
      name: "分類 1",
      pages: [{ pageNumber: 1, saveAsImage: true }],
      text: "これは分類 1 のサンプルOCR結果です。",
    },
    {
      name: "分類 2",
      pages: [
        { pageNumber: 2, saveAsImage: false },
        { pageNumber: 3, saveAsImage: true },
      ],
      text: "これは分類 2 のサンプルOCR結果です。",
    },
    {
      name: "分類 3",
      pages: [{ pageNumber: 4, saveAsImage: true }],
      text: "これは分類 3 のサンプルOCR結果です。",
    },
    {
      name: "分類 4",
      pages: [
        { pageNumber: 5, saveAsImage: false },
        { pageNumber: 6, saveAsImage: false },
        { pageNumber: 7, saveAsImage: true },
      ],
      text: "これは分類 4 のサンプルOCR結果です。",
    },
    {
      name: "分類 5",
      pages: [{ pageNumber: 8, saveAsImage: true }],
      text: "これは分類 5 のサンプルOCR結果です。",
    },
  ];

  // OCR結果をJSON形式で返却
  return NextResponse.json(classifications);
}
