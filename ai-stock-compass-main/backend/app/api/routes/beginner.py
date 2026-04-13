"""Beginner guide routes."""
from fastapi import APIRouter, Depends

from ...core.security import get_current_active_user
from ...models.user import User
from ...schemas.stock import BeginnerGuideRequest, BeginnerGuideResponse
from ...services.ai_service import ai_service

router = APIRouter(prefix="/beginner", tags=["beginner-guide"])


@router.post("/chat")
async def chat_with_ai(
    request: dict,
    current_user: User = Depends(get_current_active_user)
):
    """Interactive chat for beginner stock market education."""
    message = request.get("message", "")
    if not message:
        raise HTTPException(status_code=400, detail="Message is required")

    result = await ai_service.beginner_guide(
        question=message,
        ticker=None
    )
    return {
        "message": result["answer"],
        "related_topics": result.get("related_topics", [])
    }


@router.post("/guide", response_model=BeginnerGuideResponse)
async def get_beginner_guidance(
    request: BeginnerGuideRequest,
    current_user: User = Depends(get_current_active_user)
):
    """Get beginner-friendly guidance about stocks and investing."""
    result = await ai_service.beginner_guide(
        question=request.question,
        ticker=request.ticker
    )
    return BeginnerGuideResponse(**result)


@router.get("/topics")
async def get_beginner_topics(
    current_user: User = Depends(get_current_active_user)
):
    """Get common beginner topics."""
    topics = [
        {
            "id": "stock-basics",
            "title": "What is a Stock?",
            "description": "Learn the fundamentals of stocks and how they work"
        },
        {
            "id": "buying-stocks",
            "title": "How to Buy Stocks",
            "description": "Step-by-step guide to purchasing your first stock"
        },
        {
            "id": "reading-charts",
            "title": "Reading Stock Charts",
            "description": "Understanding price movements and chart patterns"
        },
        {
            "id": "risk-management",
            "title": "Managing Investment Risk",
            "description": "Learn how to protect your investments"
        },
        {
            "id": "diversification",
            "title": "Portfolio Diversification",
            "description": "Building a balanced investment portfolio"
        },
        {
            "id": "market-terms",
            "title": "Common Market Terms",
            "description": "Essential vocabulary for stock market investing"
        },
        {
            "id": "fundamental-analysis",
            "title": "Fundamental Analysis",
            "description": "Evaluating a company's financial health"
        },
        {
            "id": "technical-analysis",
            "title": "Technical Analysis",
            "description": "Using charts and indicators to make decisions"
        }
    ]
    return {"topics": topics}
