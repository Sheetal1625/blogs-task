package handlers

import (
	"auth/src/database"
	"auth/src/models"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
)

var DB *sql.DB = database.GetDB()

// JWT signing key.
var secretKey string = os.Getenv("MY_SIGN_IN_KEY")

// Handler function to add a new author
func AddAuthor(response http.ResponseWriter, request *http.Request) {
	fmt.Printf("Request for : %s\n", request.URL.Path)
	fmt.Printf("Req: %s %s\n", request.Host, request.URL.Path)
	var values models.Author
	// Decode JSON data from the request body into Author struct
	json.NewDecoder(request.Body).Decode(&values)
	// Insert data into the table
	query := "INSERT INTO authors (firstName, middleName, lastName, mobile, email, password) VALUES (?, ?, ?, ?, ?, ?);"
	stmt, err := DB.Prepare(query)
	if err != nil {
		log.Fatal(err)
	}
	defer stmt.Close()

	// Execute the prepared statement with values
	_, err = stmt.Exec(values.FirstName, values.MiddleName, values.LastName, values.Mobile, values.Email, values.Password)
	if err != nil {
		log.Fatal(err)
	}
	json.NewEncoder(response).Encode(values.Email)
}

// Function to retrieve an author by email from the database
func GetAuthorByEmail(email string) models.Author {
	query := "SELECT * FROM AUTHORS WHERE email = ?;"
	results, err := DB.Query(query, email)
	var author models.Author
	for results.Next() {
		var temp models.Author
		err = results.Scan(&temp.ID, &temp.FirstName, &temp.MiddleName, &temp.LastName, &temp.Mobile, &temp.Email, &temp.Password)
		if err != nil {
			panic(err.Error())
		}
		author = temp
	}
	return author
}

// Function to create a JWT token for authorization
func CreateToken(authorId uint64, author models.Author) (string, error) {
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

// Handler function to delete an author by email
func DeleteAuthorByEmail(email string) {

	if email == "" {
		return
	}

	// Delete author from the database
	query := "DELETE FROM authors WHERE email = ?"
	stmt, err := DB.Prepare(query)
	if err != nil {
		log.Fatal(err)
	}
	defer stmt.Close()

	_, err = stmt.Exec(email)
	if err != nil {
		return
	}

}

// Handler function for author login
func Login(response http.ResponseWriter, request *http.Request) {
	fmt.Printf("Request for : %s\n", request.URL.Path)
	var credential models.Credential
	// Decode JSON data from the request body into Credential struct
	err := json.NewDecoder(request.Body).Decode(&credential)
	if err != nil {
		http.Error(response, "Invalid JSON data", http.StatusBadRequest)
		return
	}

	// Get author details by email from the database
	author := GetAuthorByEmail(credential.Email)
	if author.FirstName == "" || author.Password != credential.Password {
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
