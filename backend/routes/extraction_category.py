import logging
import json
import os
import openai
import azure.functions as func
from services.azure.azure_openai import AzureOpenAIChatService
from domains.analyze_categories import ExtractionCategoryRequestData
from utils.lines_to_context import lines_to_context


def extraction_category_route(req: func.HttpRequest) -> func.HttpResponse:
    """
    分類ごとに、OCR結果からドキュメント内容を返す
    : param req: HTTPリクエスト
    : return: HTTPレスポンス
    """

    logging.info('Processing extraction_category_route request.')

    try:
        # リクエストBodyをJSONとして解析
        req_body = req.get_json()
        request_data = ExtractionCategoryRequestData(
            **req_body)  # ExtractionCategoryでバリデーション

        # 分類のpagesのcontentを取得
        pages_content = lines_to_context(
            pages=request_data.pages,
        )

        prompt = f"{request_data.target_category}"

        system_prompt = f"""あなたは業務ドキュメントをから必要な情報を抽出する役割です。
ユーザーメッセージで抽出するべき内容の題名（抽出対象分類名）が与えられます。
ドキュメントの内容から抽出対象分類名に該当する情報を漏れなく抽出してください。

◆ 補足情報の解説
- 「------ 全分類 ------」は、ドキュメント全体の分類名です。
- 「------ Markdown -------」は、ドキュメント全体の内容をMarkdownで表現したものです。
- 「------ pages -------」は、ページごとの情報を表しています。

◆ 実データ

------ 全分類 ------
{request_data.categories}


------ Markdown -------
{request_data.content_markdown}


------ pages -------
{pages_content}"""

        # Azure OpenAIサービスを初期化
        azure_openai_service = AzureOpenAIChatService(
            endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
            api_key=os.getenv("AZURE_OPENAI_API_KEY"),
            api_version="2025-01-01-preview"
        )

        # Azure OpenAIサービスを使用して、ドキュメント内容から分類に該当する情報を抽出
        try:
            aoai_response_content = azure_openai_service.completions_category_content(
                system_prompt=system_prompt,
                text=prompt,
                image_urls=[],
                deployment_name="gpt-4o-mini"
            )
        except openai.RateLimitError as e:
            logging.error(f"Rate limit error: {e}")
            return func.HttpResponse("Rate limit exceeded. Please try again later.", status_code=429)
        except Exception as e:
            logging.error(f"Error during OpenAI API call: {e}")
            return func.HttpResponse(f"Error during OpenAI API call: {e}", status_code=500)

        try:
            # レスポンスを新しい形式に変換
            response_data = {
                "category": request_data.target_category.category,
                "pages": [
                    {
                        "pageNumber": page_number,
                        "saveAsImage": False  # ページ内に複数の画像があるはずなので、実装修正必要
                    }
                    for page_number in request_data.target_category.page_numbers
                ],
                "content": aoai_response_content
            }
            # デバッグ用ログ
            logging.info(f"Extract Data response_data: {response_data}")

            # HTTPレスポンスを作成
            return func.HttpResponse(
                body=json.dumps(
                    response_data,
                    ensure_ascii=False
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
