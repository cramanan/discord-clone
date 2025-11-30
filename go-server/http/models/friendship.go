package models

import (
	"time"

	"github.com/google/uuid"
)

type Friendship struct {
	Id            uint      `gorm:"primarykey" json:"id"`
	RequesterUuid uuid.UUID `gorm:"type:uuid" json:"requesterUuid"`
	AdresseeUuid  uuid.UUID `gorm:"type:uuid" json:"adresseeUuid"`
	IsPending     bool      `gorm:"not null" json:"isPending"`
	CreatedAt     time.Time `gorm:"autoCreateTime;not null" json:"createdAt"`
	UpdatedAt     time.Time `gorm:"autoUpdateTime" json:"updatedAt"`
}
