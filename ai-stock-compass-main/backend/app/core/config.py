"""Application configuration."""
import os
from typing import List
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    """Application settings."""

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./stock_compass.db")

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-this-secret-key")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

    # APIs
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    POLYGON_API_KEY: str = os.getenv("POLYGON_API_KEY", "")
    NEWS_API_KEY: str = os.getenv("NEWS_API_KEY", "")

    # Application
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    BACKEND_URL: str = os.getenv("BACKEND_URL", "http://localhost:8000")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")

    # CORS
    @property
    def CORS_ORIGINS(self) -> List[str]:
        origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000")
        if isinstance(origins, str):
            return [origin.strip() for origin in origins.split(",")]
        return origins

    class Config:
        case_sensitive = True


settings = Settings()
