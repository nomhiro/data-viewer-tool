import openai
from openai.types import CreateEmbeddingResponse
from domains.analyze_categories import Category, CategoryList
from typing import List
import logging


class AzureOpenAIChatService:
    def __init__(self, endpoint: str, api_key: str, api_version: str) -> None:
        self.openai = openai
        self.openai.azure_endpoint = endpoint
        self.openai.api_key = api_key
        self.openai.api_version = api_version

    # 本来は画像情報も含めるべきだが、未検証未実装
    def completions_format_categories(
        self,
        system_prompt: str,
        text: str,
        deployment_name: str,
    ) -> List[Category]:
        messages: list = []
        messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": text})

        try:
            response = self.openai.beta.chat.completions.parse(
                model=deployment_name,
                messages=messages,
                response_format=CategoryList,
            )
            return response.choices[0].message.parsed.categories
        except openai.RateLimitError as e:
            logging.error(f"Rate limit error: {e}")
            raise
        except Exception as e:
            logging.error(f"Error during OpenAI API call: {e}")
            raise

    def completions_category_content(
        self,
        system_prompt: str,
        text: str,
        image_urls: list[str],
        deployment_name: str,
    ) -> List[Category]:
        messages: list = []
        messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": text})

        try:
            response = self.openai.chat.completions.create(
                model=deployment_name,
                messages=messages,
            )
            return response.choices[0].message.content
        except openai.RateLimitError as e:
            logging.error(f"Rate limit error: {e}")
            raise
        except Exception as e:
            logging.error(f"Error during OpenAI API call: {e}")
            raise
