"use client";

import { useState, useEffect } from "react";
import PdfUploader from "@/components/PdfUploader";
import PageViewer from "@/components/PageViewer";
import ClassificationManager from "@/components/ClassificationManager";
import HelpPopup from "@/components/helpComponent/HelpPopup";
import FeedbackPopup from "@/components/feedbackComponent/FeedbackPopup"; // フィードバックPopupコンポーネントをインポート
import { Classification } from "@/types/Classification";

export default function Home() {
  // PDFページ画像の状態を管理
  const [pageImages, setPageImages] = useState<string[]>([]);
  // 分類データの状態を管理
  const [classifications, setClassifications] = useState<Classification[]>([]);
  // 現在選択されている分類名を管理
  const [selectedClassification, setSelectedClassification] = useState<string | null>(null);
  // ヘルプポップアップの表示状態を管理
  const [isHelpVisible, setIsHelpVisible] = useState(false);
  // フィードバックポップアップの表示状態を管理
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);

  // 分類選択をリセットする関数
  const resetSelectedClassification = () => {
    setSelectedClassification(null);
  };

  // 分類データを登録する関数
  const handleRegister = async () => {
    if (window.confirm("登録しますか？")) {
      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ classifications }),
        });

        if (response.ok) {
          alert("登録が完了しました！");
        } else {
          alert("登録に失敗しました。");
        }
      } catch (error) {
        console.error("登録エラー:", error);
        alert("エラーが発生しました。");
      }
    }
  };

  return (
    <div className="grid grid-cols-5 min-h-screen p-4 pb-20 gap-16 sm:p-10 bg-white dark:bg-gray-900 text-black dark:text-white">
      {/* ヘルプとフィードバックボタン */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => setIsHelpVisible(!isHelpVisible)}
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          ❓
        </button>
        <button
          onClick={() => setIsFeedbackVisible(!isFeedbackVisible)}
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          💬
        </button>
      </div>
      {/* ヘルプポップアップ */}
      {isHelpVisible && <HelpPopup onClose={() => setIsHelpVisible(false)} />}
      {/* フィードバックポップアップ */}
      {isFeedbackVisible && <FeedbackPopup onClose={() => setIsFeedbackVisible(false)} />}
      {/* PDFアップロードとページ表示エリア */}
      <div className="col-span-2 flex flex-col items-center h-full">
        <PdfUploader setPageImages={setPageImages} setClassifications={setClassifications} />
        <PageViewer
          pageImages={pageImages}
          classifications={classifications}
          selectedClassification={selectedClassification}
          resetSelectedClassification={resetSelectedClassification}
        />
      </div>
      {/* 分類管理エリア */}
      <div className="col-span-3 flex flex-col items-center h-full sticky top-0 overflow-y-auto">
        <ClassificationManager
          classifications={classifications}
          setClassifications={setClassifications}
          selectedClassification={selectedClassification}
          setSelectedClassification={setSelectedClassification} // ここで渡す
        />
        {/* 登録ボタン */}
        <button
          onClick={handleRegister}
          className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          登録する
        </button>
      </div>
    </div>
  );
}