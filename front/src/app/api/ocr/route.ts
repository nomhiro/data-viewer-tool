import { NextResponse } from "next/server";
import { Classification } from "@/types/Classification";
import { Page } from "@/types/DIPage";

/**
 * OCR結果を生成するAPIエンドポイント
 * 
 * @param {Request} request - クライアントからのリクエスト
 * @returns {NextResponse} OCR結果を含むJSONレスポンス
 */
export async function POST(request: Request) {
  const { pdfBinary } = await request.json();

  // システムプロンプトを定義
  const systemPrompt = ``;

  // ドキュメント構造を分析するAPI呼び出し
  const structureResponse = await fetch("http://localhost:7071/api/analyze_document_structure", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_prompt: systemPrompt,
      pdf_binary: pdfBinary,
    }),
  });

  if (!structureResponse.ok) {
    console.error("Failed to analyze document structure");
    return NextResponse.json({ error: "Failed to analyze document structure" }, { status: 500 });
  }

  let structureData;
  try {
    structureData = await structureResponse.json();
    // console.log("Parsed JSON response:", structureData.categories);
  } catch (error) {
    console.error("Failed to parse structure analysis response:", error);
    return NextResponse.json({ error: "Invalid JSON response from structure analysis API" }, { status: 500 });
  }

  const categorizedExtractionData = [];
  for (const category of structureData.categories || []) {
    const pages: Page[] = (structureData.pages || []).filter((page: Page) =>
      category.page_numbers.includes(page.pageNumber)
    );

    const extractionPayload = {
      target_category: category,
      categories: structureData.categories,
      content_markdown: structureData.content_markdown || "",
      pages: structureData.pages || [],
    };
    console.log("Extraction Payload target_category:", extractionPayload.target_category);
    console.log("Extraction Payload categories:", extractionPayload.categories);

    // カテゴリごとのデータ抽出API呼び出し
    const extractionResponse = await fetch("http://localhost:7071/api/extraction_category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(extractionPayload),
    });

    if (!extractionResponse.ok) {
      console.error(`Failed to extract data for category: ${category.name}`);
      return NextResponse.json({ error: `Failed to extract data for category: ${category.name}` }, { status: 500 });
    }

    try {
      const extractionData = await extractionResponse.json();
      categorizedExtractionData.push(extractionData);
    } catch (error) {
      console.error("Failed to parse extraction response:", error);
      return NextResponse.json({ error: "Invalid JSON response from extraction API" }, { status: 500 });
    }
  }

  let classifications: Classification[] = []
  for (const category of categorizedExtractionData) {
    const classification: Classification = {
      category: category.category,
      pages: category.pages.map((page: Page) => ({
        pageNumber: page.pageNumber,
        saveAsImage: false,
      })),
      content: category.content || "",
    };
    classifications.push(classification);
  }

  // 抽出結果をJSON形式で返却
  return NextResponse.json(classifications);
}
