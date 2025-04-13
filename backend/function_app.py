import azure.functions as func
import logging
from routes.analyze_document import analyze_document_structure_route
from routes.extraction_category import extraction_category_route
from routes.http_trigger import http_trigger_route

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)


@app.route(route="analyze_document_structure", methods=["POST"])
def analyze_document_structure(req: func.HttpRequest) -> func.HttpResponse:
    """ analyze_document: データ構造（分類）とDocumentIntelligenceによるOCR結果を返すルート"""
    return analyze_document_structure_route(req)


@app.route(route="extraction_category", methods=["POST"])
def analyze_document(req: func.HttpRequest) -> func.HttpResponse:
    """ analyze_document_structure: 分類ごとに、OCR結果からドキュメント内容を返すルート"""
    return extraction_category_route(req)


@app.route(route="http_trigger")
def http_trigger(req: func.HttpRequest) -> func.HttpResponse:
    """ http_trigger: テスト用のHTTPトリガー"""
    return http_trigger_route(req)
