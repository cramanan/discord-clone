package models

import (
	"time"

	"github.com/google/uuid"
)

type Chats struct {
	ID           uint32     `json:"id"`
	SenderUUID   uuid.UUID  `json:"senderUuid"`
	ReceiverUUID uuid.UUID  `json:"receiverUuid"`
	Content      string     `json:"content"`
	CreatedAt    time.Time  `json:"createdAt"`
	UpdatedAt    *time.Time `json:"updatedAt"`
}
