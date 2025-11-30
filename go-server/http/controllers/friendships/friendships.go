package friendships

import (
	"errors"
	"go-server/http/middlewares"
	"go-server/http/models"
	"go-server/shared"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type QuickPayload struct {
	Addressee string `json:"addressee" binding:"required"`
}

func Quick(c *gin.Context) {
	_, err := middlewares.GetAuthedUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	var json QuickPayload
	if err = c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	database := shared.Database()
	ctx := c.Request.Context()
	addressee, err := gorm.G[models.User](database).Where("name = ?", json.Addressee).First(ctx)

	if errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, addressee)
}

type PostFrienshipPayload struct {
	AddresseeUuid string `json:"adresseeUuid" binding:"required"`
}

func POST(c *gin.Context) {
	user, err := middlewares.GetAuthedUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	var json PostFrienshipPayload

	if err = c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	database := shared.Database()
	ctx := c.Request.Context()
	adressee, err := gorm.G[models.User](database).Where("uuid = $1").First(ctx)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	payload := models.Friendship{
		Id:            0,
		RequesterUuid: user.UUID,
		AdresseeUuid:  adressee.UUID,
	}

	if err = gorm.G[models.Friendship](database).Create(ctx, &payload); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, payload)
}
