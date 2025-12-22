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

type Params struct {
	pagination.Filters
	IsPending *bool `form:"is-pending"`
}

type PreloadedRelationship struct {
	models.Relationship
	Requester models.User `json:"requester"`
}

func (PreloadedRelationship) TableName() string { return "relationships" }

func GetRelationships(c *gin.Context) {
	user, err := middlewares.GetAuthedUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	var params Params
	if err := c.ShouldBindQuery(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	query := gorm.G[PreloadedRelationship](shared.Database()).
		Where("addressee_uuid = ? OR requester_uuid = ?", user.UUID, user.UUID)

	if params.IsPending != nil {
		query = query.Where("is_pending = ?", params.IsPending)
	}

	ctx := c.Request.Context()
	total, err := query.Count(ctx, "*")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	relationships, err := query.Preload("Requester", nil).
		Offset((params.Page - 1) * params.PerPage).
		Limit(params.PerPage).
		Find(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, pagination.Page[PreloadedRelationship]{
		Data:    relationships,
		Total:   uint(total),
		Filters: params.Filters,
	})
}
