package user

import (
	"go-server/http/middlewares"
	"go-server/http/models"
	"go-server/shared"
	"go-server/types/pagination"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func GetUserChatsWithUUID(c *gin.Context) {
	sender, err := middlewares.GetAuthedUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	receiverUUID, err := uuid.Parse(c.Param("uuid"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	database := shared.Database()
	ctx := c.Request.Context()
	query := gorm.G[models.Chats](database).
		Where("sender_uuid = ? AND receiver_uuid = ?", sender.UUID, receiverUUID).
		Or("receiver_uuid = ? AND sender_uuid = ?", receiverUUID, sender.UUID)

	total, err := query.Count(ctx, "*")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	chats, err := query.Find(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, pagination.Page[models.Chats]{
		Data:  chats,
		Total: uint(total),
	})
}
