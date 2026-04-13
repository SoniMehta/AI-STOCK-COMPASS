"""Analysis history routes."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List

from ...core.database import get_db
from ...core.security import get_current_active_user
from ...models.user import User
from ...models.history import History
from ...schemas.stock import HistoryItem

router = APIRouter(prefix="/history", tags=["history"])


@router.get("", response_model=List[HistoryItem])
async def get_analysis_history(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    ticker: str = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get user's analysis history."""
    query = select(History).filter(History.user_id == current_user.id)

    if ticker:
        query = query.filter(History.ticker == ticker.upper())

    query = query.order_by(desc(History.created_at)).limit(limit).offset(offset)

    result = await db.execute(query)
    history = result.scalars().all()

    return history


@router.get("/{history_id}")
async def get_history_detail(
    history_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get detailed analysis from history."""
    result = await db.execute(
        select(History).filter(
            History.id == history_id,
            History.user_id == current_user.id
        )
    )
    history_item = result.scalar_one_or_none()

    if not history_item:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="History item not found"
        )

    return {
        "id": history_item.id,
        "ticker": history_item.ticker,
        "analysis_type": history_item.analysis_type,
        "recommendation": history_item.recommendation,
        "confidence": history_item.confidence,
        "market_trend": history_item.market_trend,
        "sentiment": history_item.sentiment,
        "risk_level": history_item.risk_level,
        "summary": history_item.summary,
        "full_analysis": history_item.full_analysis,
        "created_at": history_item.created_at
    }
