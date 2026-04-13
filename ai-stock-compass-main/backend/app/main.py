"""Main FastAPI application."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .core.config import settings
from .core.database import init_db
from .api.routes import auth, stocks, watchlist, history, news, beginner


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events."""
    # Startup: Initialize database
    await init_db()
    print("✓ Database initialized")
    yield
    # Shutdown: Clean up resources
    print("✓ Application shutdown")


# Create FastAPI app
app = FastAPI(
    title="AI Stock Compass API",
    description="AI-powered stock analysis and investment guidance platform",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(stocks.router, prefix="/api")
app.include_router(watchlist.router, prefix="/api")
app.include_router(history.router, prefix="/api")
app.include_router(news.router, prefix="/api")
app.include_router(beginner.router, prefix="/api")


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "AI Stock Compass API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
