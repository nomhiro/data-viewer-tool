# Data Viewer Tool Workspace

このリポジトリは、PDFファイルをアップロードし、各ページを画像として表示しながら、OCR結果を分類ごとに管理するツール「Data Viewer Tool」のフロントエンドとバックエンドを含むワークスペースです。

## ディレクトリ構造

```
data-viewer-tool/
├── backend/          # バックエンド関連のコードと設定
│   ├── function_app.py
│   ├── host.json
│   ├── requirements.txt
│   ├── domains/      # ドメインロジック
│   ├── routes/       # APIルート
│   ├── services/     # サービス層
│   ├── utils/        # ユーティリティ
│   └── test/         # テストコード
├── front/            # フロントエンド関連のコードと設定
│   ├── next.config.ts
│   ├── package.json
│   ├── src/          # メインアプリケーションコード
│   │   ├── app/
│   │   │   └── page.tsx
│   └── README.md     # フロントエンドの仕様説明
```

## 主な機能

- **PDFアップロード**: PDFファイルをアップロードし、各ページを画像として表示。
- **分類ごとのOCR結果管理**: 分類ごとにOCR結果を編集可能。
- **ダークモード対応**: ブラウザのダークモードに応じてUIを切り替え。
- **フィードバック機能**: 改善点を送信可能なフィードバックフォームを提供。

## フロントエンド

- **フレームワーク**: React
- **PDF処理ライブラリ**: [pdfjs-dist](https://github.com/mozilla/pdf.js)
- **スタイリング**: Tailwind CSS

詳細は [front/README.md](front/README.md) を参照してください。

## バックエンド

- **ランタイム**: Python
- **フレームワーク**: Azure Functions
- **依存関係**: `requirements.txt` に記載

## 注意事項

- アップロードされたPDFはブラウザ内で処理され、サーバーには送信されません。
- 現在のOCR結果は仮のデータであり、実際のOCR処理は含まれていません。

## 今後の改善点

- 実際のOCR処理を組み込む。
- 分類の追加・削除機能を実装。
- ページ画像のズーム機能を追加。

## 開発環境のセットアップ

### フロントエンド

1. 必要な依存関係をインストールします:
   ```bash
   cd front
   npm install
   ```

2. 開発サーバーを起動します:
   ```bash
   npm run dev
   ```

### バックエンド

1. 必要な依存関係をインストールします:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. local.settings.jsonに環境変数を設定します:
   ```json
   {
      "IsEncrypted": false,
      "Values": {
         "AzureWebJobsStorage": "",
         "FUNCTIONS_WORKER_RUNTIME": "python",
         "DI_ENDPOINT": "Document Intelligenceのエンドポイント",
         "DI_KEY": "Document Intelligenceのキー",
         "AZURE_OPENAI_ENDPOINT": "Azure OpenAIのエンドポイント",
         "AZURE_OPENAI_API_KEY": "Azure OpenAIのキー",
      }
   }
   ```
2. ローカル環境でAzure Functionsを起動します: ※デバッグしたいならF5実行
   ```bash
   func start
   ```