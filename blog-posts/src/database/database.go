package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
)

// Database connection string
var dbHost string = os.Getenv("DATABASE_BLOGS")

// JWT signing key.
var secretKey string = os.Getenv("MY_SIGN_IN_KEY")

// Function to establish a database connection
func GetDB() *sql.DB {
	db, err := sql.Open("mysql", dbHost)
	if err != nil {
		log.Fatal(err)
	}
	// Check if the connection is successful
	err = db.Ping()
	if err != nil {
		log.Fatal("Error connecting to the database: ", err)
	}
	fmt.Println("Connected to MySQL database!")

	return db

}
