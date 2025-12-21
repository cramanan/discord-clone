package users

import (
	"errors"
	"go-server/http/middlewares"
	"go-server/http/models"
	"go-server/shared"
	"go-server/types/pagination"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetUserByUuid(c *gin.Context) {
	_, err := middlewares.GetAuthedUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	user, err := gorm.G[models.User](shared.Database()).
		Where("uuid = ?", c.Param("uuid")).
		First(c.Request.Context())
	if errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Not Found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

type SearchParams struct {
	pagination.Filters
	Query string `form:"query" json:"query,omitempty"`
}

func GetUsers(c *gin.Context) {
	// _, err := middlewares.GetAuthedUser(c)
	// if err != nil {
	// 	c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
	// 	return
	// }

	var params SearchParams
	// Bind query parameters to the struct
	if err := c.ShouldBindQuery(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := c.Request.Context()
	baseQuery := gorm.G[models.User](shared.Database())

	total, err := baseQuery.Count(ctx, "*")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	query := baseQuery.
		Offset((params.Page - 1) * params.PerPage).
		Limit(params.PerPage)

	if params.Query != "" {
		query = query.Where("LOWER(name) LIKE CONCAT('%', LOWER(?), '%')", params.Query)
	}

	users, err := query.Find(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, pagination.Page[models.User]{
		Data:    users,
		Total:   uint(total),
		Filters: params.Filters,
	})
}
