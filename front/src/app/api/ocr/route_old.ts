import { NextResponse } from "next/server";
import { Classification } from "@/types/Classification";

/**
 * OCR結果を生成するAPIエンドポイント
 * 
 * @param {Request} request - クライアントからのリクエスト
 * @returns {NextResponse} OCR結果を含むJSONレスポンス
 */
export async function POST(request: Request) {
  const { pageCount, pdfBinary } = await request.json();

  // 外部APIにPOSTリクエストを送信
  // const response = await fetch("http://localhost:7071/api/analyze_document", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     system_prompt: "あなたは自動車の制御設計の業務ドキュメントを分析し...",
  //     pdf_binary: pdfBinary,
  //   }),
  // });

  // if (!response.ok) {
  //   console.error("Failed to fetch data from external API");
  //   return NextResponse.json({ error: "Failed to fetch data from external API" }, { status: 500 });
  // }

  // let responseData;
  // try {
  //   const contentType = response.headers.get("Content-Type") || "";
  //   let responseText = await response.text(); // レスポンスをテキストとして取得

  //   if (contentType.includes("application/json")) {
  //     // JSON.parse前に整形処理を実施
  //     responseText = responseText
  //       .replace(/[\r\n]+/g, "\\n") // 改行をエスケープ
  //       .replace(/"/g, '\\"') // ダブルクォートをエスケープ
  //       .replace(/'/g, '"'); // シングルクォートをダブルクォートに置き換え

  //     responseData = JSON.parse(responseText); // JSONパースを試みる
  //     console.log("Parsed JSON response:", responseData.content_markdown);
  //   } else {
  //     console.error("Unexpected content type:", contentType);
  //     return NextResponse.json({ error: "Unexpected content type from external API" }, { status: 500 });
  //   }
  // } catch (error) {
  //   console.error("Failed to parse JSON response:", error);
  //   return NextResponse.json({ error: "Invalid JSON response from external API" }, { status: 500 });
  // }

  // 仮のOCR結果を生成
  const classifications: Classification[] = [
    {
      category: "分類 1",
      pages: [{ pageNumber: 1, saveAsImage: true }],
      content: "これは分類 1 のサンプルOCR結果です。",
    },
    {
      category: "分類 2",
      pages: [
        { pageNumber: 2, saveAsImage: false },
        { pageNumber: 3, saveAsImage: true },
      ],
      content: "これは分類 2 のサンプルOCR結果です。",
    },
    {
      category: "分類 3",
      pages: [{ pageNumber: 4, saveAsImage: true }],
      content: "これは分類 3 のサンプルOCR結果です。",
    },
    {
      category: "分類 4",
      pages: [
        { pageNumber: 5, saveAsImage: false },
        { pageNumber: 6, saveAsImage: false },
        { pageNumber: 7, saveAsImage: true },
      ],
      content: "これは分類 4 のサンプルOCR結果です。",
    },
    {
      category: "分類 5",
      pages: [{ pageNumber: 8, saveAsImage: true }],
      content: "これは分類 5 のサンプルOCR結果です。",
    },
  ];

  // OCR結果をJSON形式で返却
  return NextResponse.json(classifications);
}
