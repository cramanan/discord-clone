package shared

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

func Database() *gorm.DB {
	if db != nil {
		return db
	}
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using system env")
	}

	rawURL := os.Getenv("DATABASE_URL")
	if rawURL == "" {
		log.Fatal("DATABASE_URL is not set")
	}

	db, err = gorm.Open(postgres.Open(rawURL), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	return db
}
