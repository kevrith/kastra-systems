from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas
from auth import get_current_user, require_role

router = APIRouter(prefix="/announcements", tags=["Announcements"])


@router.get("", response_model=List[schemas.AnnouncementResponse])
def get_all_announcements(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    announcements = db.query(models.Announcement).order_by(
        models.Announcement.created_at.desc()
    ).all()

    # Add created_by_name to each announcement
    result = []
    for announcement in announcements:
        announcement_dict = {
            "id": announcement.id,
            "title": announcement.title,
            "content": announcement.content,
            "target_audience": announcement.target_audience,
            "created_by_id": announcement.created_by_id,
            "created_by_name": f"{announcement.created_by.first_name} {announcement.created_by.last_name}",
            "created_at": announcement.created_at
        }
        result.append(announcement_dict)

    return result


@router.post("", response_model=schemas.AnnouncementResponse)
def create_announcement(
    announcement_data: schemas.AnnouncementCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin", "teacher"))
):
    announcement = models.Announcement(
        title=announcement_data.title,
        content=announcement_data.content,
        target_audience=announcement_data.target_audience,
        created_by_id=current_user.id
    )
    db.add(announcement)
    db.commit()
    db.refresh(announcement)

    # Return with created_by_name
    return {
        "id": announcement.id,
        "title": announcement.title,
        "content": announcement.content,
        "target_audience": announcement.target_audience,
        "created_by_id": announcement.created_by_id,
        "created_by_name": f"{current_user.first_name} {current_user.last_name}",
        "created_at": announcement.created_at
    }


@router.delete("/{announcement_id}")
def delete_announcement(
    announcement_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin", "teacher"))
):
    announcement = db.query(models.Announcement).filter(
        models.Announcement.id == announcement_id
    ).first()
    if not announcement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Announcement not found"
        )

    # Only allow deletion by creator or admin
    if current_user.role != models.RoleEnum.admin and announcement.created_by_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this announcement"
        )

    db.delete(announcement)
    db.commit()
    return {"message": "Announcement deleted successfully"}
