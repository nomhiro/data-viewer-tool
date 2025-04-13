import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownPreviewPopupProps {
  content: string; // プレビューするMarkdownコンテンツ
  onClose: () => void; // ポップアップを閉じる関数
}

export default function MarkdownPreviewPopup({ content, onClose }: MarkdownPreviewPopupProps) {
  const [position, setPosition] = useState({ x: 500, y: 200 }); // ポップアップの初期位置
  const [dragging, setDragging] = useState(false); // ドラッグ中かどうかのフラグ
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 }); // ドラッグ開始位置

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
      className="fixed bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-lg rounded-lg p-4 w-[600px] z-50" // サイズを大きく変更
      style={{ top: position.y, left: position.x, cursor: dragging ? "grabbing" : "grab" }}
    >
      <div>
        {/* ヘッダー部分（タイトルと閉じるボタン） */}
        <div
          className="flex justify-between items-center mb-4 cursor-move"
          onMouseDown={handleMouseDown}
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Markdown Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ✖️
          </button>
        </div>
        {/* Markdownコンテンツ */}
        <div className="overflow-y-auto max-h-[500px]"> {/* 高さも調整 */}
          <div className="prose dark:prose-dark">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
