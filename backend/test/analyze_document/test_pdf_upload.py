import requests
import base64
import json
import os

# エンドポイントURLを定義
url = "http://localhost:7071/api/"

# テスト用PDFファイルのパス
# pdf_path = "./test/消費者をエンパワーするデジタル技術に関する専門調査会の設置の趣旨及び今後の進め方_202404.pdf"
pdf_path = "./test/消費者トラブルの現状.pdf"
output_path = "./test/"

# output.json と output.txt を削除
if os.path.exists(os.path.join(output_path, "output.json")):
    os.remove(os.path.join(output_path, "output.json"))
if os.path.exists(os.path.join(output_path, "output.txt")):
    os.remove(os.path.join(output_path, "output.txt"))

print("✅ ドキュメント内から分類を抽出します")

# PDFファイルを読み込み、Base64形式でエンコード
with open(pdf_path, "rb") as pdf_file:
    encoded_pdf = base64.b64encode(pdf_file.read()).decode("utf-8")

# システムプロンプトを定義
system_prompt = """"""

# リクエストペイロードを作成
payload = {
    "system_prompt": system_prompt,
    "pdf_binary": encoded_pdf
}

# JSONペイロードを含むPOSTリクエストを送信
response = requests.post(
    url=url+"analyze_document_structure",
    headers={"Content-Type": "application/json"},
    data=json.dumps(payload)
)

# レスポンスのステータスコードを確認
if response.status_code != 200:
    # エラーメッセージを表示
    print(
        f"✖ エラー {response.status_code} : ドキュメントのOCRと分類分析APIでエラーです。  \n{response.reason}")
    raise Exception(
        f"ドキュメント構造の分析に失敗しました。ステータスコード: {response.status_code}")

try:
    # レスポンスを直接JSONとして解析
    response_data = response.json()

    # JSONレスポンスをファイルに保存
    with open(os.path.join(output_path, "output_categories.json"), "w") as output_file:
        output_file.write(json.dumps(
            response_data, indent=4, ensure_ascii=False))
    print("   レスポンスを output.json に保存しました")
except json.JSONDecodeError:
    # JSON形式でないレスポンスを処理
    print("✖ エラー: レスポンスがJSON形式ではありません。")  # エラーメッセージを表示
    raise Exception("レスポンスがJSON形式ではありません。")
except Exception as e:
    # その他のエラーを処理
    print(f"✖ エラー: {str(e)}")


print("✅ 分類ごとにドキュメントからデータ化します。")
categorized_extraction_data = []
for category in response_data.get("categories", []):
    print(f"   - {category}")
    # category["page_number"]のリストに含まれるページを取得
    pages = [page for page in response_data["pages"]
             if page["page_number"] in category["page_numbers"]]

    payload_extraction = {
        "target_category": category,
        "categories": response_data["categories"],
        "content_markdown": response_data.get("content_markdown", ""),
        "pages": pages
    }

    # JSONペイロードを含むPOSTリクエストを送信
    response = requests.post(
        url=url+"extraction_category",
        headers={"Content-Type": "application/json"},
        data=json.dumps(payload_extraction)
    )

    categorized_extraction_data.append(response.json())

# レスポンスのステータスコードを確認
if response.status_code != 200:
    # エラーメッセージを表示
    print(
        f"✖ エラー {response.status_code} : ドキュメントのOCRと分類分析APIでエラーです。  \n{response.reason}")
    raise Exception(
        f"ドキュメント構造の分析に失敗しました。ステータスコード: {response.status_code}")

try:
    # レスポンスを直接JSONとして解析
    response_data = response.json()

    # JSONレスポンスをファイルに保存
    with open(os.path.join(output_path, "output_extract_categories.json"), "w") as output_file:
        output_file.write(json.dumps(
            categorized_extraction_data, indent=4, ensure_ascii=False))

    print("   レスポンスを output_categories.json に保存しました")

except json.JSONDecodeError:
    # JSON形式でないレスポンスを処理
    print("✖ エラー: レスポンスがJSON形式ではありません。")
    raise Exception("レスポンスがJSON形式ではありません。")
except Exception as e:
    # その他のエラーを処理
    print(f"✖ エラー: {str(e)}")
