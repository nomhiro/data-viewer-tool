from domains.analyze_categories import Page
from typing import List


def lines_to_context(pages: List[Page]) -> List:
    """
    Pageオブジェクトのlinesからテキストを改行区切りで取得し、
    コンテキストとpage_numberを含む辞書のリストを返す
    """

    pages_content = []
    for page in pages:
        page_content = "\n".join(
            line["content"] for line in page.lines  # 辞書アクセスに変更
        )
        pages_content.append({
            "context": page_content,
            "page_number": page.page_number
        })

    return pages_content
