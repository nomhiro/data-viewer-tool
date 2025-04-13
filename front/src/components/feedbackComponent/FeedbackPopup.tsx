"use client";

import React, { useState } from "react";

interface FeedbackPopupProps {
  onClose: () => void; // ポップアップを閉じる関数
}

/**
 * フィードバックポップアップコンポーネント
 * 
 * @param {Object} props - コンポーネントのプロパティ
 * @param {() => void} props.onClose - ポップアップを閉じるための関数
 * @returns {JSX.Element} フィードバックポップアップUI
 */
export default function FeedbackPopup({ onClose }: FeedbackPopupProps) {
  // ポップアップの位置を管理する状態
  const [position, setPosition] = useState({ x: window.innerWidth - 350, y: 80 }); // 初期位置をヘルプアイコンの下に設定
  const [dragging, setDragging] = useState(false); // ドラッグ中かどうかのフラグ
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 }); // ドラッグ開始位置
  const [feedback, setFeedback] = useState(""); // フィードバック内容

  /**
   * ドラッグ開始時の処理
   * 
   * @param {React.MouseEvent<HTMLDivElement>} e - マウスイベント
   */
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  /**
   * ドラッグ中の処理
   * 
   * @param {MouseEvent} e - マウスイベント
   */
  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  /**
   * ドラッグ終了時の処理
   */
  const handleMouseUp = () => {
    setDragging(false);
  };

  // イベントリスナーの登録と解除
  React.useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, dragStart]);

  /**
   * フィードバック送信時の処理
   */
  const handleSubmit = () => {
    console.log("フィードバック:", feedback);
    alert("フィードバックを送信しました。ありがとうございます！");
    setFeedback(""); // 入力内容をリセット
    onClose(); // ポップアップを閉じる
  };

  return (
    <div
      className="fixed bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-lg rounded-lg p-4 w-80 z-50"
      style={{ top: position.y, left: position.x, cursor: dragging ? "grabbing" : "grab" }}
    >
      {/* ヘッダー部分（タイトルと閉じるボタン） */}
      <div
        className="flex justify-between items-center mb-4 cursor-move"
        onMouseDown={handleMouseDown}
      >
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">フィードバック</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ✖️
        </button>
      </div>
      {/* フィードバック入力エリア */}
      <textarea
        className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-black dark:text-white"
        placeholder="改善してほしいことを入力してください..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        rows={5}
      />
      {/* 送信ボタン */}
      <button
        onClick={handleSubmit}
        className="mt-4 w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        送信
      </button>
    </div>
  );
}
