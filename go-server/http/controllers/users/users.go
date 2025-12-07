package users

import (
	"errors"
	"go-server/http/middlewares"
	"go-server/http/models"
	"go-server/shared"
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

	database := shared.Database()
	ctx := c.Request.Context()
	user, err := gorm.G[models.User](database).Where("uuid = ?", c.Param("uuid")).First(ctx)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Not Found"})
		return
	}

	c.JSON(http.StatusOK, user)
}
