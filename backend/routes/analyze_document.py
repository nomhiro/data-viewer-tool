import logging
import os
import base64
import json
import html
import azure.functions as func
import openai
from services.azure.document_intelligence import AzureAIDocumentIntelligenceService
from services.azure.azure_openai import AzureOpenAIChatService
from domains.analyze_categories import Category, AnalyzeDocStructureResponseData
from typing import List

# ログ設定を追加
logging.basicConfig(level=logging.DEBUG,
                    format='[%(asctime)s] %(levelname)s: %(message)s')


def analyze_document_structure_route(req: func.HttpRequest) -> func.HttpResponse:
    """ドキュメント構造を解析するHTTPエンドポイント。
    この関数は、リクエストボディに含まれるPDFバイナリデータを解析し、
    ドキュメント全体の構造や分類情報を抽出します。
    抽出された情報はJSON形式でレスポンスとして返されます。
    :param req: HTTPリクエストオブジェクト。リクエストボディには以下のフィールドが必要です:
        - system_prompt (str): 分類用のプロンプト。
        - pdf_binary (str): PDFファイルのBase64エンコードされたバイナリデータ。
    :return: HTTPレスポンスオブジェクト
        - 200: 正常に解析が完了した場合。
        - 400: リクエストボディに必要なフィールドが不足している場合、またはバリデーションエラーが発生した場合。
        - 500: サーバー内部エラーが発生した場合。
    処理の流れ:
    1. リクエストボディをJSONとして解析し、必要なフィールドを取得。
    2. PDFバイナリデータをデコード。
    3. Azure Document Intelligenceサービスを使用してPDFを解析。
    4. ページごとの内容を抽出し、プロンプトを生成。
    5. Azure OpenAIサービスを使用して分類情報を抽出。
    6. 抽出結果をレスポンスデータとして整形し、JSON形式で返却。
    注意:
    - Azure Document IntelligenceサービスとAzure OpenAIサービスのエンドポイントおよびAPIキーは
      環境変数 `DI_ENDPOINT`, `DI_KEY`, `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_API_KEY` から取得します。
    - エラーハンドリングを行い、適切なエラーメッセージをレスポンスとして返します。

    """

    logging.info('Processing analyze_document_structure request.')

    try:
        # リクエストBodyをJSONとして解析
        req_body = req.get_json()
        classification_prompt = req_body.get(
            "classification_prompt")  # 分類用のプロンプト
        pdf_binary = req_body.get("pdf_binary")  # PDFファイルのバイナリデータ

        # システムメッセージに、システム上固定の推論の指示を追加
        # TOOD: 本来はDBなどに外だし
        system_prompt = f"""あなたは与えられた業務ドキュメントを分析し、ドキュメントの内容を考慮して構造的な文書にする役割です。

# 指示
ドキュメント内容を情報のまとまりで分類分けしてください。
分類に紐づくドキュメントのページ番号を出力してください。

# ユーザメッセージで与えられるデータの説明
- 「-------------------- Markdown --------------------」は、ドキュメント全体をMarkdownで表現したものです。
- 「-------------------- pages --------------------」は、ページごとの情報を表しています。

# ルール
- 「-------------------- Markdown --------------------」の内容を元に、ドキュメント全体の構造を理解して分類名を生成してください。
- 「-------------------- pages --------------------」のJson情報を元に、page_numberを提示してください。
    - 「# ページ番号」と「## ページ内容」が与えられます。
    - 与えられた「# ページ番号」以外のページ番号は出力してはいけません。
    - page_numberは分類ごとに被っても構いません。
- 「ユーザから指示された分類」は必ず含むようにしてください。
- 分類の追加は自由です。

# ユーザから指示された分類
{classification_prompt}

# 出力形式
- category: 分類の各項目名
- page_number: 分類に紐づくページ番号

# 出力形式例
{{
    [
        {{
            "category": "目次の各項目名",
            "page_numbers": [
                1, 2
            ]
        }}
    ]
}}"""

        if not pdf_binary or not system_prompt:
            return func.HttpResponse("Missing required fields in request body.", status_code=400)

        # PDFバイナリをデコード
        pdf_binary = base64.b64decode(pdf_binary)

        # Document Intelligenceサービスを初期化
        DI_ENDPOINT = os.getenv("DI_ENDPOINT")
        DI_KEY = os.getenv("DI_KEY")
        document_intelligence_service = AzureAIDocumentIntelligenceService(
            endpoint=DI_ENDPOINT, api_key=DI_KEY
        )

        # PDFを解析して内容を取得
        di_response = document_intelligence_service.analyze_document(
            pdf_binary)

        # pagesをMarkdown形式に変換
        pages_markdown = "\n".join(
            f"# ページ番号: {page['page_number']}\n"
            f"## ページ内容:\n" +
            "\n".join(line["content"] for line in page["lines"])
            for page in di_response["pages"]
        )

        prompt = f"""-------------------- Markdown --------------------
{di_response["content_markdown"]}

-------------------- pages --------------------
{pages_markdown}"""

        # Azure OpenAIサービスを初期化
        azure_openai_service = AzureOpenAIChatService(
            endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
            api_key=os.getenv("AZURE_OPENAI_API_KEY"),
            api_version="2025-01-01-preview"
        )

        # 分類を抽出
        try:
            aoai_response_content = azure_openai_service.completions_format_categories(
                system_prompt=system_prompt,
                text=prompt,
                deployment_name="gpt-4o"
            )
        except openai.RateLimitError as e:
            logging.error(f"Rate limit error: {e}")
            return func.HttpResponse("Rate limit exceeded. Please try again later.", status_code=429)
        except Exception as e:
            logging.error(f"Error during OpenAI API call: {e}")
            return func.HttpResponse(f"Error during OpenAI API call: {e}", status_code=500)

        try:
            # Include Document Intelligence data in the response
            response_data = AnalyzeDocStructureResponseData(
                categories=aoai_response_content,
                content_markdown=html.escape(di_response["content_markdown"]),
                pages=di_response["pages"],
            )

            # デバッグ用ログ
            logging.info(
                f"Analyze Doc response_data: {response_data.categories}")

            # HTTPレスポンスを作成
            return func.HttpResponse(
                body=json.dumps(
                    response_data.dict(),
                    ensure_ascii=False,
                    default=lambda o: o.dict() if hasattr(o, 'dict') else str(o)
                ),
                status_code=200,
                mimetype="application/json"
            )
        except Exception as e:
            logging.error(f"Error serializing JSON: {e}")
            return func.HttpResponse(f"Error serializing JSON: {e}", status_code=500)
    except ValueError as ve:
        logging.error(f"Validation error: {ve}")
        return func.HttpResponse(f"Validation error: {ve}", status_code=400)
    except Exception as e:
        logging.error(f"Error analyzing document structure: {e}")
        return func.HttpResponse(f"Error analyzing document structure: {e}", status_code=500)
