import os
from azure.core.credentials import AzureKeyCredential
from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.ai.documentintelligence.models import AnalyzeResult, DocumentAnalysisFeature, DocumentContentFormat, AnalyzeOutputOption
from utils.document_utils import get_words


class AzureAIDocumentIntelligenceService:
    def __init__(self, endpoint: str, api_key: str) -> None:
        self.client = DocumentIntelligenceClient(
            endpoint=endpoint, credential=AzureKeyCredential(api_key)
        )

    def analyze_document(self, pdf_binary: bytes) -> dict:
        try:
            # PDFバイナリを直接渡して分析
            poller = self.client.begin_analyze_document(
                "prebuilt-layout",
                body=pdf_binary,
                features=[],
                output_content_format=DocumentContentFormat.MARKDOWN,
                output=[AnalyzeOutputOption.FIGURES],
            )
            result: AnalyzeResult = poller.result()
        except Exception as e:
            raise ValueError(f"Failed to analyze document: {e}")

        response_data = {
            # "content_markdown": result.content.replace("\r\n", "\\n").replace("\n", "\\n").replace('"', '\\"'),
            "content_markdown": result.content,
            "pages": [],
        }
        for page in result.pages:
            page_data = {
                "page_number": page.page_number,
                "width": page.width,
                "height": page.height,
                "lines": [],
                "tables": [],
                "figures": [],
            }

            if page.lines:
                for line in page.lines:
                    page_data["lines"].append({
                        "content": line.content,
                        "polygon": getattr(line, "polygon", []),
                        "spans": getattr(line, "spans", []),
                    })

            # ページ内のテーブルデータを追加
            for table in result.tables:
                for region in table.bounding_regions:
                    if region.page_number == page.page_number:
                        table_data = {
                            "row_count": table.row_count,
                            "column_count": table.column_count,
                            "cells": [
                                {
                                    "row_index": cell.row_index,
                                    "column_index": cell.column_index,
                                    "content": cell.content,
                                    "bounding_regions": cell.bounding_regions,
                                }
                                for cell in table.cells
                            ],
                        }
                        page_data["tables"].append(table_data)

            # ページ内の図データを追加
            for figure in result.figures:
                for region in figure.bounding_regions:
                    if region.page_number == page.page_number:
                        figure_data = {
                            "id": figure.id,
                            "bounding_regions": figure.bounding_regions,
                            "spans": figure.spans,
                            "elements": figure.elements,
                        }
                        page_data["figures"].append(figure_data)

            response_data["pages"].append(page_data)

        return response_data
