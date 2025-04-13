import { NextResponse } from "next/server";
import { Classification } from "@/types/Classification";

/**
 * 分類データを受け取り、登録処理を行うAPIエンドポイント
 * 
 * @param request - クライアントから送信されたリクエストオブジェクト
 * @returns NextResponse - 処理結果を含むレスポンスオブジェクト
 */
export async function POST(request: Request) {
  try {
    // リクエストボディから分類データを取得
    const { classifications }: { classifications: Classification[] } = await request.json();

    // 分類データが存在しない場合はエラーレスポンスを返す
    if (!classifications || classifications.length === 0) {
      return NextResponse.json({ message: "分類データがありません。" }, { status: 400 });
    }

    // 登録処理（ここでデータベース保存などを実行）
    console.log("登録データ:", classifications);

    // 成功レスポンスを返す
    return NextResponse.json({ message: "登録が完了しました。" });
  } catch (error) {
    // エラー発生時のログ出力とエラーレスポンス
    console.error("登録エラー:", error);
    return NextResponse.json({ message: "登録中にエラーが発生しました。" }, { status: 500 });
  }
}
