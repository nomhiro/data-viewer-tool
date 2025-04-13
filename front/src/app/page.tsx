"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      {/* アプリのタイトル */}
      <h1 className="text-2xl font-bold mb-8">データビューアツール</h1>
      <div className="flex flex-col gap-4">
        {/* データ登録画面へのリンク */}
        <Link
          href="/data/regist"
          className="p-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          データ登録画面へ
        </Link>
        {/* データ編集画面へのリンク */}
        <Link
          href="/data/edit"
          className="p-4 bg-green-500 text-white rounded hover:bg-green-600"
        >
          データ編集画面へ
        </Link>
        {/* チャット画面へのリンク */}
        <Link
          href="/chat"
          className="p-4 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          チャット画面へ
        </Link>
      </div>
    </div>
  );
}