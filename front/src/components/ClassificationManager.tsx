"use client";

import { useState } from "react";
import { Classification } from "@/types/Classification";
import MarkdownPreviewPopup from "./MarkdownPreviewPopup/MarkdownPreviewPopup"; // 新しいコンポーネントをインポート

interface ClassificationManagerProps {
  classifications: Classification[]; // 現在の分類リスト
  setClassifications: React.Dispatch<React.SetStateAction<Classification[]>>; // 分類リストを更新する関数
  selectedClassification: string | null; // 現在選択されている分類名
  setSelectedClassification: React.Dispatch<React.SetStateAction<string | null>>; // 選択された分類を更新する関数
}

/**
 * 分類管理コンポーネント
 * 
 * @param {Object} props - コンポーネントのプロパティ
 * @param {Classification[]} props.classifications - 現在の分類リスト
 * @param {React.Dispatch<React.SetStateAction<Classification[]>>} props.setClassifications - 分類リストを更新する関数
 * @param {string | null} props.selectedClassification - 現在選択されている分類名
 * @param {React.Dispatch<React.SetStateAction<string | null>>} props.setSelectedClassification - 選択された分類を更新する関数
 * @returns {JSX.Element} 分類管理UI
 */
export default function ClassificationManager({
  classifications,
  setClassifications,
  selectedClassification,
  setSelectedClassification,
}: ClassificationManagerProps) {
  const [expandedClassifications, setExpandedClassifications] = useState<Set<string>>(new Set()); // 展開中の分類セット
  const [editingClassification, setEditingClassification] = useState<number | null>(null); // 編集中の分類インデックス
  const [popupContent, setPopupContent] = useState<string | null>(null); // ポップアップの内容を管理
  const [popupVisible, setPopupVisible] = useState(false); // ポップアップの表示状態を管理

  /**
   * 分類の展開/折りたたみを切り替える関数
   * 
   * @param {string} classificationName - 対象の分類名
   */
  const toggleClassificationExpansion = (classificationName: string) => {
    setExpandedClassifications((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(classificationName)) {
        newSet.delete(classificationName);
        // アコーディオンが閉じられた場合、ポップアップを非表示にする
        if (popupContent === classifications.find(c => c.category === classificationName)?.content) {
          setPopupVisible(false);
          setPopupContent(null);
        }
      } else {
        newSet.add(classificationName);
      }
      return newSet;
    });
  };

  return (
    <div className="w-full flex flex-col gap-4 mt-8">
      {/* 各分類をリスト表示 */}
      {classifications.map((classification, index) => (
        <div key={index} className="border rounded p-2 bg-white dark:bg-gray-800">
          <div className="flex items-start">
            {/* 分類の上下移動ボタン */}
            <div className="flex flex-col items-center mr-2">
              {/* 上に移動 */}
              <button
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
                  if (index > 0) {
                    const newClassifications = [...classifications];
                    [newClassifications[index - 1], newClassifications[index]] = [
                      newClassifications[index],
                      newClassifications[index - 1],
                    ];
                    setClassifications(newClassifications);
                  }
                }}
              >
                <span className="material-icons">Up</span>
              </button>
              {/* 下に移動 */}
              <button
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mt-1"
                onClick={(e) => {
                  e.stopPropagation();
                  if (index < classifications.length - 1) {
                    const newClassifications = [...classifications];
                    [newClassifications[index + 1], newClassifications[index]] = [
                      newClassifications[index],
                      newClassifications[index + 1],
                    ];
                    setClassifications(newClassifications);
                  }
                }}
              >
                <span className="material-icons">Down</span>
              </button>
            </div>
            {/* 分類名と編集機能 */}
            <div className="relative flex-grow">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => {
                  if (editingClassification === null) {
                    toggleClassificationExpansion(classification.category);
                    setSelectedClassification(classification.category); // Expanderクリック時に選択
                  }
                }}
              >
                <div className="flex items-center">
                  {/* 編集中の場合はテキストボックスを表示 */}
                  {editingClassification === index ? (
                    <input
                      type="text"
                      className="flex-grow p-1 border rounded bg-white dark:bg-gray-800 text-black dark:text-white"
                      value={classification.category}
                      onChange={(e) => {
                        const newClassifications = [...classifications];
                        newClassifications[index] = { ...classification, category: e.target.value };
                        setClassifications(newClassifications);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setEditingClassification(null);
                        }
                      }}
                      onBlur={() => setEditingClassification(null)}
                    />
                  ) : (
                    <div className="flex items-center">
                      <span className="font-bold text-blue-500 dark:text-blue-400">
                        {classification.category}
                      </span>
                      {/* 編集ボタン */}
                      <button
                        className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingClassification(index);
                        }}
                      >
                        ✏️
                      </button>
                    </div>
                  )}
                </div>
                {/* 削除ボタン */}
                <button
                  className="ml-2 text-red-500 hover:text-red-700 dark:hover:text-red-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`「${classification.category}」を削除しますか？`)) {
                      const newClassifications = classifications.filter((_, i) => i !== index);
                      setClassifications(newClassifications);
                      setExpandedClassifications((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(classification.category);
                        return newSet;
                      });
                    }
                  }}
                >
                  🗑️
                </button>
              </div>
              {/* 分類が展開されている場合の詳細表示 */}
              {expandedClassifications.has(classification.category) && (
                <div className="mt-2">
                  {/* ページごとのスイッチ型UI */}
                  <div className="mb-2">
                    {classification.pages.map(({ pageNumber, saveAsImage }) => (
                      <div key={pageNumber} className="flex items-center mb-1">
                        <label className="mr-2 text-sm text-gray-700 dark:text-gray-300">
                          ページ {pageNumber} を画像として保存
                        </label>
                        <div
                          className={`relative w-10 h-6 flex items-center rounded-full cursor-pointer ${saveAsImage ? "bg-green-500" : "bg-gray-300"
                            }`}
                          onClick={() => {
                            const newClassifications = [...classifications];
                            const page = newClassifications[index].pages.find(
                              (p) => p.pageNumber === pageNumber
                            );
                            if (page) {
                              page.saveAsImage = !page.saveAsImage;
                            }
                            setClassifications(newClassifications);
                          }}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${saveAsImage ? "translate-x-4" : "translate-x-0"
                              }`}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* テキストエリア */}
                  <div className="relative">
                    <textarea
                      className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-black dark:text-white"
                      value={classification.content}
                      style={{ height: `${Math.max(100, classification.category.split("\n").length * 24)}px` }}
                      onChange={(e) => {
                        const newClassifications = [...classifications];
                        newClassifications[index] = { ...classification, content: e.target.value };
                        setClassifications(newClassifications);
                      }}
                      onClick={() => setSelectedClassification(classification.category)}
                    />
                    {/* プレビューアイコン */}
                    <button
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      onClick={(e) => {
                        e.stopPropagation(); // イベントのバブリングを防止
                        if (popupContent !== classification.content) {
                          setPopupContent(classification.content); // 新しい内容を設定
                          setPopupVisible(true); // ポップアップを表示
                        }
                      }}
                    >
                      🔍
                    </button>
                  </div>
                  {/* MarkdownプレビューPopup */}
                  {popupVisible && popupContent && (
                    <MarkdownPreviewPopup
                      content={popupContent}
                      onClose={() => {
                        setPopupVisible(false); // ポップアップを非表示
                        setPopupContent(null); // 内容をリセット
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      {/* 新しい分類を追加するボタン */}
      <button
        className="flex items-center justify-center w-full p-2 mt-4 text-white bg-green-500 rounded hover:bg-green-600"
        onClick={() => {
          const newClassification = {
            category: `新しい分類 ${classifications.length + 1}`,
            pages: [],
            content: "",
          };
          setClassifications([...classifications, newClassification]);
          setExpandedClassifications((prev) => {
            const newSet = new Set(prev);
            newSet.add(newClassification.category);
            return newSet;
          });
        }}
      >
        ＋ 新しい分類を追加
      </button>
    </div>
  );
}
