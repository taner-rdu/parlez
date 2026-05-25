import boto3
from functools import lru_cache
import os

from pydantic_settings import BaseSettings


@lru_cache()
def get_anthropic_api_key() -> str:
    if key := os.environ.get("ANTHROPIC_API_KEY"):
        return key
    client = boto3.client('secretsmanager', region_name='us-east-1')
    response = client.get_secret_value(SecretId='parlez/anthropic-api-key')
    return response['SecretString']


@lru_cache()
def get_gcp_credentials():
    import json
    from google.oauth2 import service_account
    if path := os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"):
        return service_account.Credentials.from_service_account_file(path)
    client = boto3.client('secretsmanager', region_name='us-east-1')
    response = client.get_secret_value(SecretId='parlez/gcp-tts-key')
    info = json.loads(response['SecretString'])
    return service_account.Credentials.from_service_account_info(info)


@lru_cache()
def get_deepl_api_key() -> str:
    # Prefer env var so CI (and local dev) can inject the key without needing AWS credentials.
    # Falls back to Secrets Manager for production deployments.
    if key := os.environ.get("DEEPL_API_KEY"):
        return key
    client = boto3.client('secretsmanager', region_name='us-east-1')
    response = client.get_secret_value(SecretId='parlez/deepl-api-key')
    return response['SecretString']


class Settings(BaseSettings):
    """Application settings loaded from environment variables.

    Attributes:
        app_name: Display name for the application
        debug: Enable debug mode for development
    """
    app_name: str = "Parlez"
    debug: bool = False
    deepl_api_key: str = ""

    class Config:
        env_file = "../.env"  # Load from project root
        extra = "ignore"


settings = Settings()  # Singleton instance used throughout the app
