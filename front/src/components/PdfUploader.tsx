"use client";

import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";
import { Classification } from "@/types/Classification";

interface PdfUploaderProps {
  setPageImages: React.Dispatch<React.SetStateAction<string[]>>; // PDFページ画像を設定する関数
  setClassifications: (classifications: Classification[]) => void; // 分類リストを設定する関数
}

/**
 * PDFファイルをアップロードし、各ページを画像としてレンダリングするコンポーネント
 * 
 * @param {Object} props - コンポーネントのプロパティ
 * @param {React.Dispatch<React.SetStateAction<string[]>>} props.setPageImages - PDFページ画像を設定する関数
 * @param {(classifications: Classification[]) => void} props.setClassifications - OCR結果を分類リストとして設定する関数
 * @returns {JSX.Element} PDFアップロードUI
 */
export default function PdfUploader({ setPageImages, setClassifications }: PdfUploaderProps) {
  /**
   * PDFファイルをアップロードし、各ページを画像としてレンダリングする処理
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} event - ファイル選択イベント
   */
  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = async () => {
      const typedArray = new Uint8Array(fileReader.result as ArrayBuffer);
      const pdf = await pdfjsLib.getDocument(typedArray).promise;

      const images: string[] = [];
      // PDFの各ページを画像としてレンダリング
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (context) {
          const renderContext = { canvasContext: context, viewport };
          await page.render(renderContext).promise;
          images.push(canvas.toDataURL("image/jpeg")); // 画像データを保存
        }
      }

      setPageImages(images);

      // PDFデータをBase64エンコード
      const pdfBinary = btoa(
        new Uint8Array(fileReader.result as ArrayBuffer)
          .reduce((data, byte) => data + String.fromCharCode(byte), "")
      );

      // OCR結果を取得するAPIを呼び出し
      const response = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageCount: pdf.numPages, pdfBinary }),
      });

      if (response.ok) {
        const ocrClassifications: Classification[] = await response.json();
        setClassifications(ocrClassifications); // OCR結果を反映
      } else {
        console.error("Failed to fetch OCR results");
      }
    };

    fileReader.readAsArrayBuffer(file);
  };

  return (
    <>
      {/* PDFアップロードボタン */}
      <label
        htmlFor="pdf-upload"
        className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500"
      >
        Upload PDF
      </label>
      <input
        id="pdf-upload"
        type="file"
        accept="application/pdf"
        onChange={handlePdfUpload}
        className="hidden"
      />
    </>
  );
}
