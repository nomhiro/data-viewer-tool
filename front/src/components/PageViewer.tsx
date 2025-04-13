"use client";

import { Classification } from "@/types/Classification";

interface PageViewerProps {
  pageImages: string[]; // PDFページの画像データ
  classifications: Classification[]; // 分類リスト
  selectedClassification: string | null; // 現在選択されている分類名
  resetSelectedClassification: () => void; // 分類選択をリセットする関数
}

/**
 * ページビューアコンポーネント
 * 
 * @param {Object} props - コンポーネントのプロパティ
 * @param {string[]} props.pageImages - PDFページの画像データ
 * @param {Classification[]} props.classifications - 分類リスト
 * @param {string | null} props.selectedClassification - 現在選択されている分類名
 * @param {() => void} props.resetSelectedClassification - 分類選択をリセットする関数
 * @returns {JSX.Element} ページビューアUI
 */
export default function PageViewer({ pageImages, classifications, selectedClassification, resetSelectedClassification }: PageViewerProps) {
  /**
   * 指定された分類に関連付けられたページ番号を取得
   * 
   * @param {string} classificationName - 分類名
   * @returns {number[]} 分類に関連付けられたページ番号の配列
   */
  const getPagesForClassification = (classificationName: string) => {
    const classification = classifications.find((c) => c.category === classificationName);
    return classification ? classification.pages.map((page) => page.pageNumber) : [];
  };

  /**
   * 表示するページ番号を取得
   * 
   * @returns {number[]} 表示するページ番号の配列
   */
  const getVisiblePages = () => {
    if (selectedClassification) {
      return getPagesForClassification(selectedClassification); // 選択された分類に関連付けられたページを表示
    }
    return Array.from({ length: pageImages.length }, (_, i) => i + 1); // 全ページを表示
  };

  return (
    <div
      className="mt-4 overflow-y-scroll h-[calc(100vh-8rem)] w-full border border-gray-300 dark:border-gray-700"
      style={{ maxHeight: "100%" }}
    >
      {/* 分類選択がある場合、リセットボタンを表示 */}
      {selectedClassification && (
        <button
          onClick={resetSelectedClassification}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          全ページ表示に戻す
        </button>
      )}
      {/* 表示するページをループして描画 */}
      {getVisiblePages().map((pageNumber) => (
        <div key={pageNumber} className="flex flex-col items-center mb-4">
          {/* ページ番号を表示 */}
          <span className="text-sm text-gray-700 dark:text-gray-300 mb-2">ページ {pageNumber}</span>
          {/* ページ画像を表示 */}
          <img
            src={pageImages[pageNumber - 1]}
            alt={`Page ${pageNumber}`}
            className="max-w-full h-auto"
          />
        </div>
      ))}
    </div>
  );
}
