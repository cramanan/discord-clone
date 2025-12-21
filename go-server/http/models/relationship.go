package models

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Relationship struct {
	ID            uint       `json:"id"`
	RequesterUUID uuid.UUID  `json:"requesterUuid"`
	AddresseeUUID uuid.UUID  `json:"addresseeUuid"`
	IsPending     bool       `json:"isPending"`
	CreatedAt     time.Time  `gorm:"autoCreateTime;not null" json:"createdAt"`
	UpdatedAt     *time.Time `gorm:"autoUpdateTime" json:"updatedAt"`
}

func (relationship *Relationship) BeforeSave(tx *gorm.DB) error {
	if relationship.RequesterUUID == uuid.Nil {
		return errors.New("error: relationship.RequesterUUID should not be uuid.Nil")
	}

	if relationship.AddresseeUUID == uuid.Nil {
		return errors.New("error: relationship.AddresseeUUID should not be uuid.Nil")
	}

	return nil
}
func (relationship *Relationship) BeforeCreate(tx *gorm.DB) error { return relationship.BeforeSave(tx) }
func (relationship *Relationship) BeforeUpdate(tx *gorm.DB) error { return relationship.BeforeSave(tx) }
