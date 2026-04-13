"""Watchlist routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import List

from ...core.database import get_db
from ...core.security import get_current_active_user
from ...models.user import User
from ...models.watchlist import Watchlist
from ...schemas.stock import WatchlistItem
from ...services.polygon_service import polygon_service

router = APIRouter(prefix="/watchlist", tags=["watchlist"])


@router.get("", response_model=List[WatchlistItem])
async def get_watchlist(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get user's watchlist."""
    result = await db.execute(
        select(Watchlist)
        .filter(Watchlist.user_id == current_user.id)
        .order_by(Watchlist.added_at.desc())
    )
    watchlist = result.scalars().all()
    return watchlist


@router.post("/{ticker}", response_model=WatchlistItem, status_code=status.HTTP_201_CREATED)
async def add_to_watchlist(
    ticker: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Add a stock to watchlist."""
    ticker = ticker.upper()

    # Check if already in watchlist
    result = await db.execute(
        select(Watchlist).filter(
            and_(
                Watchlist.user_id == current_user.id,
                Watchlist.ticker == ticker
            )
        )
    )
    existing = result.scalar_one_or_none()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Stock already in watchlist"
        )

    # Get company name from Polygon.io
    company_profile = await polygon_service.get_company_profile(ticker)
    company_name = company_profile.get("name") if company_profile else None

    # Add to watchlist
    watchlist_item = Watchlist(
        user_id=current_user.id,
        ticker=ticker,
        company_name=company_name
    )

    db.add(watchlist_item)
    await db.commit()
    await db.refresh(watchlist_item)

    return watchlist_item


@router.delete("/{ticker}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_watchlist(
    ticker: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Remove a stock from watchlist."""
    ticker = ticker.upper()

    result = await db.execute(
        select(Watchlist).filter(
            and_(
                Watchlist.user_id == current_user.id,
                Watchlist.ticker == ticker
            )
        )
    )
    watchlist_item = result.scalar_one_or_none()

    if not watchlist_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stock not in watchlist"
        )

    await db.delete(watchlist_item)
    await db.commit()
