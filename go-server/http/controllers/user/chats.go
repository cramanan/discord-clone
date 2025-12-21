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

type SearchParams struct {
	pagination.Filters
	SortBy    string `form:"sort-by,default=created_at" binding:"oneof=id name created_at"`
	SortOrder string `form:"sort-order,default=desc" binding:"oneof=asc desc"`
}

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

	var params SearchParams
	// Bind query parameters to the struct
	if err := c.ShouldBindQuery(&params); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	ctx := c.Request.Context()
	query := gorm.G[models.Chat](shared.Database()).
		Where("sender_uuid = ? AND receiver_uuid = ?", sender.UUID, receiverUUID).
		Or("receiver_uuid = ? AND sender_uuid = ?", receiverUUID, sender.UUID).
		Order(params.SortBy + " " + params.SortOrder)

	total, err := query.Count(ctx, "*")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	chats, err := query.
		Offset((params.Page - 1) * params.PerPage).
		Limit(params.PerPage).
		Find(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, pagination.Page[models.Chat]{
		Data:    chats,
		Total:   uint(total),
		Filters: params.Filters,
	})
}
