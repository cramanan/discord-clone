package relationships

import (
	"go-server/http/middlewares"
	"go-server/http/models"
	"go-server/shared"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PostRelationshipPayload struct {
	AddresseeUUID uuid.UUID `json:"addresseeUuid" binding:"required"`
}

func PostRelationship(c *gin.Context) {
	requester, err := middlewares.GetAuthedUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	var payload PostRelationshipPayload
	if err = c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	relationship := &models.Relationship{
		RequesterUUID: requester.UUID,
		AddresseeUUID: payload.AddresseeUUID,
		IsPending:     true,
	}
	if err = gorm.G[models.Relationship](shared.Database()).
		Create(c.Request.Context(), relationship); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, relationship)
}
