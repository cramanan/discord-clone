package models

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	UUID      uuid.UUID  `gorm:"type:uuid;primaryKey" json:"uuid"`
	Email     string     `gorm:"uniqueIndex;not null" json:"email"`
	Name      string     `gorm:"not null" json:"name"`
	Password  string     `gorm:"not null" json:"-"`
	Avatar    *string    `json:"avatar"`
	CreatedAt time.Time  `gorm:"autoCreateTime;not null" json:"createdAt"`
	UpdatedAt *time.Time `gorm:"autoUpdateTime" json:"updatedAt"`
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	if u.Email == "" {
		return errors.New("email cannot be empty")
	}
	if u.Name == "" {
		return errors.New("name cannot be empty")
	}
	if u.Password == "" {
		return errors.New("password cannot be empty")
	}
	u.UUID = uuid.New()
	return
}
