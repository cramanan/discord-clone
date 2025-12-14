package models

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Chat struct {
	ID           uint32     `json:"id"`
	SenderUUID   uuid.UUID  `json:"senderUuid"`
	ReceiverUUID uuid.UUID  `json:"receiverUuid"`
	Content      string     `json:"content"`
	CreatedAt    time.Time  `json:"createdAt"`
	UpdatedAt    *time.Time `json:"updatedAt"`
}

func (chat *Chat) BeforeSave(tx *gorm.DB) error {
	if chat.SenderUUID == uuid.Nil {
		return errors.New("error: chat.SenderUUID should not be uuid.Nil")
	}

	if chat.ReceiverUUID == uuid.Nil {
		return errors.New("error: chat.ReceiverUUID should not be uuid.Nil")
	}

	return nil
}
func (chat *Chat) BeforeCreate(tx *gorm.DB) error { return chat.BeforeSave(tx) }
func (chat *Chat) BeforeUpdate(tx *gorm.DB) error { return chat.BeforeSave(tx) }
