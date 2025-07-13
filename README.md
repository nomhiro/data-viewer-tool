# Data Viewer Tool

PDFファイルをアップロードして、各ページを画像として表示しながら、Azure Document IntelligenceとAzure OpenAIを使用してOCR結果を分類ごとに管理するWebアプリケーションです。

## 🚀 主な機能

- **PDFアップロード・表示**: PDFファイルをアップロードし、各ページを画像として表示
- **OCR処理**: Azure Document Intelligenceを使用したOCR処理
- **AI分類・抽出**: Azure OpenAIを使用したコンテンツの自動分類と抽出
- **分類管理**: 分類ごとにOCR結果を編集・管理
- **チャット機能**: AIとの対話による文書分析
- **データ編集**: 抽出したデータの編集機能
- **レスポンシブUI**: ダークモード対応のモダンなインターフェース

## 📁 プロジェクト構造

```
data-viewer-tool/
├── frontend/                # フロントエンド (Next.js)
│   ├── src/
│   │   ├── app/            # Next.js App Router
│   │   │   ├── chat/       # チャット機能
│   │   │   ├── data/       # データ管理機能
│   │   │   └── api/        # API Routes
│   │   ├── components/     # Reactコンポーネント
│   │   └── types/          # TypeScript型定義
│   ├── package.json
│   └── README.md
├── backend/                # バックエンド (Azure Functions)
│   ├── function_app.py     # Azure Functions エントリーポイント
│   ├── routes/             # APIルート
│   ├── services/           # Azure連携サービス
│   ├── domains/            # ビジネスロジック
│   ├── utils/              # ユーティリティ
│   ├── test/               # テストコード
│   └── requirements.txt    # Python依存関係
└── README.md               # このファイル
```

## 🛠️ 技術スタック

### フロントエンド
- **Next.js 15** - React フレームワーク
- **TypeScript** - 型安全性
- **Tailwind CSS** - スタイリング
- **PDF.js** - PDF表示・処理
- **React Markdown** - Markdown表示

### バックエンド
- **Python** - プログラミング言語
- **Azure Functions** - サーバーレス実行環境
- **Azure Document Intelligence** - OCR・文書分析
- **Azure OpenAI** - AI言語モデル

## ⚙️ セットアップ手順

### 前提条件
- Node.js 18以上
- Python 3.9以上
- Azure アカウント
- Azure CLI
- Azure Functions Core Tools

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd data-viewer-tool
```

### 2. フロントエンドのセットアップ
```bash
cd front
npm install
npm run dev
```

### 3. バックエンドのセットアップ

#### 依存関係のインストール
```bash
cd backend
pip install -r requirements.txt
```

#### 環境変数の設定
`backend/local.settings.json` を作成:
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "python",
    "DI_ENDPOINT": "your-document-intelligence-endpoint",
    "DI_KEY": "your-document-intelligence-key",
    "AZURE_OPENAI_ENDPOINT": "your-azure-openai-endpoint",
    "AZURE_OPENAI_API_KEY": "your-azure-openai-key"
  }
}
```

#### Azure Functions の起動
```bash
func start
```

## 📚 API エンドポイント

- `POST /api/analyze_document_structure` - 文書構造解析・分類
- `POST /api/extraction_category` - 分類別コンテンツ抽出
- `GET /api/http_trigger` - ヘルスチェック

## 🔧 開発・デバッグ

### フロントエンド開発サーバー
```bash
cd front
npm run dev
```
http://localhost:3000 でアクセス

### バックエンドデバッグ
Visual Studio CodeでF5キーを押すか、以下のコマンド:
```bash
cd backend
func start --verbose
```

### テスト実行
```bash
cd backend
python -m pytest test/
```

## 🌐 本番環境へのデプロイ

### フロントエンド (Vercel推奨)
```bash
cd front
npm run build
```

### バックエンド (Azure Functions)
```bash
cd backend
func azure functionapp publish <your-function-app-name>
```

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🤝 コントリビューション

プルリクエストやイシューの報告を歓迎します。開発に参加する前に、プロジェクトの構造とコーディング規約を確認してください。

## ⚠️ 注意事項

- Azure Document IntelligenceとAzure OpenAIの使用には課金が発生します
- APIキーやエンドポイントは適切に管理し、公開リポジトリにコミットしないでください
- 本番環境では適切なセキュリティ設定を行ってください