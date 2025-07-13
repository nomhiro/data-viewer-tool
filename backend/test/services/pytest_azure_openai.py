import pytest
from unittest.mock import patch, MagicMock
from services.azure.azure_openai import AzureOpenAIChatService

@pytest.fixture
def mock_openai(monkeypatch):
    mock = MagicMock()
    monkeypatch.setattr("services.azure.azure_openai.openai", mock)
    return mock

def test_init_sets_openai_attributes(mock_openai):
    endpoint = "https://example.com"
    api_key = "test-key"
    api_version = "2023-06-01-preview"

    service = AzureOpenAIChatService(endpoint, api_key, api_version)

    assert service.openai is mock_openai
    assert mock_openai.azure_endpoint == endpoint
    assert mock_openai.api_key == api_key
    assert mock_openai.api_version == api_version

def test_init_with_empty_strings(mock_openai):
    endpoint = ""
    api_key = ""
    api_version = ""

    service = AzureOpenAIChatService(endpoint, api_key, api_version)

    assert service.openai is mock_openai
    assert mock_openai.azure_endpoint == ""
    assert mock_openai.api_key == ""
    assert mock_openai.api_version == ""

def test_init_with_none_values(mock_openai):
    endpoint = None
    api_key = None
    api_version = None

    service = AzureOpenAIChatService(endpoint, api_key, api_version)

    assert service.openai is mock_openai
    assert mock_openai.azure_endpoint is None
    assert mock_openai.api_key is None
    assert mock_openai.api_version is None