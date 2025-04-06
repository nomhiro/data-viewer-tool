"use client";

import React, { useState } from "react"; // Reactをインポート

interface HelpPopupProps {
  onClose: () => void;
}

export default function HelpPopup({ onClose }: HelpPopupProps) {
  const [position, setPosition] = useState({ x: window.innerWidth - 400, y: 20 }); // 初期位置を右上に設定
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  // イベントリスナーを登録
  React.useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, dragStart]);

  return (
    <div
      className="fixed bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-lg rounded-lg p-4 w-80 z-50"
      style={{ top: position.y, left: position.x, cursor: dragging ? "grabbing" : "grab" }}
    >
      <div
        className="flex justify-between items-center mb-4 cursor-move"
        onMouseDown={handleMouseDown}
      >
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">ヘルプ</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ✖️
        </button>
      </div>
      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc pl-5">
        <li>分類ごとに検索データ化される</li>
        <li>分類名とテキスト結果が、検索データ及び推論情報として利用される。</li>
        <li>画像ONにすると、推論時に画像も利用される。</li>
      </ul>
    </div>
  );
}
