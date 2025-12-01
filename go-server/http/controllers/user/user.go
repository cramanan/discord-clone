package user

import (
	"go-server/http/middlewares"
	"go-server/http/models"
	"go-server/shared"
	"go-server/types/pagination"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type PreloadedFriendship struct {
	models.Friendship
	// Relationships
	Addressee models.User `gorm:"foreignKey:AddresseeUuid;references:UUID" json:"addressee"`
}

func (PreloadedFriendship) TableName() string {
	return "friendships"
}

func PendingFriendRequests(c *gin.Context) {
	requester, err := middlewares.GetAuthedUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	database := shared.Database()
	ctx := c.Request.Context()

	baseQuery := gorm.G[PreloadedFriendship](database).Preload("Addressee", nil).Where("requester_uuid = ?", requester.UUID).Where("is_pending = TRUE")

	friendships, err := baseQuery.Find(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, pagination.Page[PreloadedFriendship]{
		Data:  friendships,
		Total: 0,
	})
}
