from pydantic import BaseModel
from typing import List, Dict, Any


class Category(BaseModel):
    category: str
    page_numbers: List[int]


class CategoryList(BaseModel):
    """
    Categoryのリストをラップするモデル
    """
    categories: List[Category]


class AnalyzeDocStructureResponseData(BaseModel):
    """
    analyze_document_structureのレスポンスデータ
    """
    categories: List[Category]
    content_markdown: str
    pages: List[Dict[str, Any]]


class Page(BaseModel):
    """
    extraction_category ルートのリクエストパラメータの一部
    ページ情報を表すモデル
    """
    page_number: int
    width: float
    height: float
    lines: List[Dict[str, Any]]
    tables: List[Dict[str, Any]] = []
    figures: List[Dict[str, Any]] = []


class ExtractionCategoryRequestData(BaseModel):
    """
    extraction_category ルートのリクエストパラメータ
    - target_category: 対象のカテゴリ
    - categories: 全カテゴリ
    - content_markdown: ドキュメント全体のMarkdown形式
    - pages: ターゲットカテゴリに該当するページ情報
    """
    target_category: Category
    categories: List[Category]
    content_markdown: str
    pages: List[Page]
