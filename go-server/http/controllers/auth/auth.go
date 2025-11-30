package auth

import (
	"errors"
	"go-server/http/middlewares"
	"go-server/http/models"
	"go-server/shared"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type RegisterPayload struct {
	Email    string `json:"email" binding:"required"`
	Name     string `json:"name" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func Register(c *gin.Context) {
	var json RegisterPayload
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := shared.Database()
	ctx := c.Request.Context()

	_, err := gorm.G[models.User](db).
		Where("email = ?", json.Email).
		First(ctx)

	if err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "User already exists"})
		return
	}

	if !errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(json.Password), 12)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	user := models.User{
		Email:    json.Email,
		Name:     json.Name,
		Password: string(hashedPassword),
	}

	if err = gorm.G[models.User](db).Create(ctx, &user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{"sub": user.UUID.String()}).SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	secure := c.Request.TLS != nil

	c.SetCookie("jwt", token, 60*60*24*7, "/", "127.0.0.1:8080", secure, true)
	c.JSON(http.StatusCreated, gin.H{"token": token})
}

type LoginPayload struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func Login(c *gin.Context) {
	var json LoginPayload
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := shared.Database()
	ctx := c.Request.Context()

	user, err := gorm.G[models.User](db).
		Where("email = ?", json.Email).
		First(ctx)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(json.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{"sub": user.UUID.String()}).SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	secure := c.Request.TLS != nil

	c.SetCookie("jwt", token, 60*60*24*7, "/", "", secure, true)
	log.Println(token)
	c.JSON(http.StatusOK, gin.H{"token": token})
}

func Authenticate(c *gin.Context) {
	user, err := middlewares.GetAuthedUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	c.JSON(http.StatusOK, user)
}
func Logout(c *gin.Context) {
	secure := c.Request.TLS != nil
	c.SetCookie("jwt", "", 0, "/", "", secure, true)
	c.JSON(http.StatusNoContent, "")
}
