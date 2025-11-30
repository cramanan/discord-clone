package main

import (
	"fmt"
	"go-server/http/controllers/auth"
	"go-server/http/controllers/friendships"
	"go-server/http/middlewares"
	"go-server/shared"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"gorm.io/gorm"
)

var DB *gorm.DB

func main() {
	var err error
	// Load .env
	if err = godotenv.Load(); err != nil {
		log.Println("No .env file found, using system env")
	}

	db := shared.Database()
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalln(err)
	}

	if err := sqlDB.Ping(); err != nil {
		log.Fatal(err)
	}
	log.Println("Database connected successfully!")

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		router := gin.Default()
		// Default CORS configuration (allows all origins)
		router.Use(cors.New(cors.Config{
			AllowAllOrigins:  true,
			AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
			AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
			ExposeHeaders:    []string{"Content-Length"},
			AllowCredentials: true,
			MaxAge:           12 * time.Hour, // preflight cache duration
		}))
		router.POST("/auth/register", auth.Register)
		router.POST("/auth/login", auth.Login)
		router.GET("/auth/user", middlewares.AuthMiddleware(), auth.Authenticate)

		router.POST("/quick/friendship", middlewares.AuthMiddleware(), friendships.Quick)

		fmt.Println("Server is running. Press Ctrl+C to stop.")
		// Simulate work
		router.Run()
	}()

	<-quit
	fmt.Println("\nShutting down gracefully...")

	if err := sqlDB.Close(); err != nil {
		log.Println("Error closing database:", err)
	} else {
		fmt.Println("Database connection closed")
	}

	fmt.Println("Server exited")
}
