package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"encoding/json"
"os"
"time"
"github.com/dgrijalva/jwt-go"
"errors"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	_ "github.com/go-sql-driver/mysql"
)


// Author struct represents author details
type Author struct {
	ID         int    `json:"id"`
	FirstName  string `json:"firstName"`
	MiddleName string `json:"middleName"`
	LastName   string `json:"lastName"`
	Mobile     string    `json:"mobile`
	Email      string `json:"email`
	Password   string `json:"password`
}


// Credential struct represents login credentials
type Credential struct{
	Email string `json:"email`
	Password string `json:"password"`
}


// Database connection string
var dbHost string = os.Getenv("DATABASE_BLOGS")

// JWT signing key.
var secretKey string = os.Getenv("MY_SIGN_IN_KEY")

// Function to establish a database connection
func getDB() *sql.DB{
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


// Handler function to add a new author
func AddAuthor(response http.ResponseWriter, request *http.Request){
var values Author
// Decode JSON data from the request body into Author struct
	 json.NewDecoder(request.Body).Decode(&values)
	// Insert data into the table
	query := "INSERT INTO authors (firstName, middleName, lastName, mobile, email, password) VALUES (?, ?, ?, ?, ?, ?);"
	db := getDB()
	stmt, err := db.Prepare(query)
	if err != nil {
		log.Fatal(err)
	}
	defer stmt.Close()

	// Execute the prepared statement with values
	_, err = stmt.Exec( values.FirstName, values.MiddleName, values.LastName, values.Mobile, values.Email, values.Password)
	if err != nil {
		log.Fatal(err)
	}
	json.NewEncoder(response).Encode(values.Email)
}

// Function to retrieve an author by email from the database
func GetAuthorByEmail(email string) Author{
	query := "SELECT * FROM AUTHORS WHERE email = ?;"
	db := getDB()
	results, err := db.Query(query, email)
	var author Author
	for results.Next() {
		var temp Author
		err = results.Scan(&temp.ID, &temp.FirstName, &temp.MiddleName, &temp.LastName, &temp.Mobile, &temp.Email, &temp.Password)
		if err != nil {
			panic(err.Error())
		}
		author = temp
	}
	return author
}

// Function to create a JWT token for authorization
func CreateToken(authorId uint64, author Author) (string, error) {
	var err error
	// Set the secret key for JWT signing
	os.Setenv("ACCESS_SECRET", secretKey)
	atClaims := jwt.MapClaims{}
	atClaims["authorized"] = true
	atClaims["authorId"] = authorId
	atClaims["firstName"] = author.FirstName
	atClaims["exp"] = time.Now().Add(time.Minute * 15).Unix()
	at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
	// Generate the JWT token
	token, err := at.SignedString([]byte(os.Getenv("ACCESS_SECRET")))
	if err != nil {
		return "", errors.New("an error occured during the create token")
	}
	return token, nil
}

// Handler function for author login
func Login(response http.ResponseWriter, request *http.Request) {
	var credential Credential
	// Decode JSON data from the request body into Credential struct
	err := json.NewDecoder(request.Body).Decode(&credential)
	if err != nil {
		http.Error(response, "Invalid JSON data", http.StatusBadRequest)
		return
	}

	// Get author details by email from the database
	author := GetAuthorByEmail(credential.Email)
	if (author.FirstName == ""  || author.Password != credential.Password) {
		// If credentials are incorrect, return unauthorized status
		http.Error(response, "Please provide the correct credentials to login", http.StatusUnauthorized)
		return
	}

	// Create JWT token for the authorized user
	token, err := CreateToken(uint64(author.ID), author)
	if err != nil {
		http.Error(response, "An error occurred during token creation", http.StatusInternalServerError)
		return
	}

	// Set the token in the response header and encode it in the response body
	response.Header().Set("Token", token)
	json.NewEncoder(response).Encode(token)
}


func main(){
	// Create a new router using github.com/gorilla/mux
	router := mux.NewRouter()

	// Define HTTP routes for adding an author and author login
	router.HandleFunc("/api/author",AddAuthor).Methods("POST")
	router.HandleFunc("/api/auth",Login).Methods("POST")
	// Setup CORS handling for the router
	corsHandler := cors.New(cors.Options{
		AllowedMethods: []string{"POST"},
	}).Handler(router)
	http.Handle("/", corsHandler)

	// Start HTTP server on port 5002
	port := "5002"
	fmt.Println("Server is running on :", port)
	http.ListenAndServe(":"+port, nil)
}
