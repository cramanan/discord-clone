package middlewares

import (
	"errors"
	"go-server/http/models"
	"go-server/shared"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"
)

func GetAuthedUser(c *gin.Context) (*models.User, error) {
	rawUser, exists := c.Get("user")
	if !exists {
		return nil, errors.New("Unauthenticated")
	}
	user, ok := rawUser.(*models.User)
	if !ok {
		return nil, errors.New("Internal server error")
	}
	return user, nil
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		token, err := c.Cookie("jwt") // TODO: remove magic value
		if err != nil || token == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		parsedToken, err := jwt.Parse(token, func(t *jwt.Token) (any, error) { return []byte(os.Getenv("JWT_SECRET")), nil })
		if err != nil || !parsedToken.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		subject, err := parsedToken.Claims.GetSubject()
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		database := shared.Database()
		user, err := gorm.G[models.User](database).Where("uuid = ?", subject).First(c.Request.Context())
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		c.Set("user", &user)
		c.Next()
	}
}
