import boto3
from functools import lru_cache

from pydantic_settings import BaseSettings


@lru_cache()
def get_deepl_api_key() -> str:
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
        env_file = ".env"  # Automatically load variables from .env file


settings = Settings()  # Singleton instance used throughout the app
