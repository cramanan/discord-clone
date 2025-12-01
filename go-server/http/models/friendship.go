package models

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Friendship struct {
	Id            uint       `gorm:"primarykey" json:"id"`
	RequesterUuid uuid.UUID  `gorm:"type:uuid" json:"requesterUuid"`
	AddresseeUuid uuid.UUID  `gorm:"type:uuid" json:"addresseeUuid"`
	IsPending     bool       `gorm:"not null" json:"isPending"`
	CreatedAt     time.Time  `gorm:"autoCreateTime;not null" json:"createdAt"`
	UpdatedAt     *time.Time `gorm:"autoUpdateTime" json:"updatedAt"`
}

func (f *Friendship) BeforeCreate(tx *gorm.DB) (err error) {
	if f.RequesterUuid == uuid.Nil {
		return errors.New("requester UUID cannot be empty")
	}
	if f.AddresseeUuid == uuid.Nil {
		return errors.New("addresee UUID cannot be empty")
	}
	return
}
