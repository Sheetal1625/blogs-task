package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/dgrijalva/jwt-go"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

// Author struct represents author data.
type Author struct {
	ID         int    `json:"id"`
	FirstName  string `json:"firstName"`
	MiddleName string `json:"middleName"`
	LastName   string `json:"lastName"`
	Mobile     string `json:"mobile`
	Email      string `json:"email`
	Password   string `json:"password`
}

// Post struct represents post data.
type Post struct {
	ID          int    `json:"id"`
	AuthorId    int    `json:"authorId"`
	Title       string `json:"title"`
	Content     string `json:"content"`
	PublishedAt string `json:"publishedAt`
}

// Database connection string.
var dbHost string = os.Getenv("DATABASE_BLOGS")

// JWT signing key.
var secretKey string = os.Getenv("MY_SIGN_IN_KEY")

// Database Connection
var db *sql.DB = getDB()

// Function to establish a database connection.
func getDB() *sql.DB {
	db, err := sql.Open("mysql", dbHost)
	if err != nil {
		log.Fatal(err)
	}
	// Check if the connection is successful
	err = db.Ping()
	if err != nil {
		log.Fatal("Error connecting to the database: ", err)
	}

	return db

}

// AuthMiddleware is JWT token validation middleware.
func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
		authHeader := request.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(response, "Authorization header is missing", http.StatusUnauthorized)
			return
		}

		tokenString := strings.Replace(authHeader, "Bearer ", "", 1)

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return []byte(secretKey), nil
		})

		if err != nil || !token.Valid {
			http.Error(response, "Invalid or expired token", http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(response, request)
	})
}

// GetAllRecentPosts retrieves all recent posts.
func GetAllRecentPosts(response http.ResponseWriter, request *http.Request) {
	var values Post
	json.NewDecoder(request.Body).Decode(&values)

	query := "SELECT * FROM POSTS ORDER BY PublishedAt DESC;"
	results, err := db.Query(query)
	var posts []Post
	for results.Next() {
		var temp Post
		err = results.Scan(&temp.ID, &temp.AuthorId, &temp.Title, &temp.Content, &temp.PublishedAt)
		if err != nil {
			panic(err.Error())
		}
		posts = append(posts, temp)
	}
	json.NewEncoder(response).Encode(posts)

}

// GetPostById retrieves a post by post ID.
func GetPostById(response http.ResponseWriter, request *http.Request) {
	params := mux.Vars(request)
	id, err := strconv.Atoi(params["id"])
	query := "SELECT * FROM POSTS WHERE ID = ?;"
	results, err := db.Query(query, id)
	var post Post
	for results.Next() {
		var temp Post
		err = results.Scan(&temp.ID, &temp.AuthorId, &temp.Title, &temp.Content, &temp.PublishedAt)
		if err != nil {
			panic(err.Error())
		}
		post = temp
	}
	json.NewEncoder(response).Encode(post)
}

// get posts by authorId
func GetAllPostsByAuthorId(response http.ResponseWriter, request *http.Request) {
	params := mux.Vars(request)
	authorId, err := strconv.Atoi(params["authorId"])
	if err != nil {
		http.Error(response, "Invalid author ID", http.StatusBadRequest)
		return
	}
	query := "SELECT * FROM POSTS WHERE authorId = ?;"
	results, err := db.Query(query, authorId)
	var posts []Post
	for results.Next() {
		var temp Post
		err = results.Scan(&temp.ID, &temp.AuthorId, &temp.Title, &temp.Content, &temp.PublishedAt)
		if err != nil {
			panic(err.Error())
		}
		posts = append(posts, temp)
	}
	json.NewEncoder(response).Encode(posts)
}

// CreatePost creates a new post.
func CreatePost(response http.ResponseWriter, request *http.Request) {
	var values Post
	json.NewDecoder(request.Body).Decode(&values)

	// Insert data into the table
	query := "INSERT INTO posts (id, authorId, title, content, publishedAt) VALUES (?, ?, ?, ?, NOW());"
	stmt, err := db.Prepare(query)
	if err != nil {
		log.Fatal(err)
	}
	defer stmt.Close()

	// Execute the prepared statement with values
	_, err = stmt.Exec(values.ID, values.AuthorId, values.Title, values.Content)
	if err != nil {
		log.Fatal(err)
	}
	json.NewEncoder(response).Encode(values)
}

// UpdatePostById updates a post by post ID.
func UpdatePostById(response http.ResponseWriter, request *http.Request) {
	params := mux.Vars(request)
	id, err := strconv.Atoi(params["id"])
	var values Post
	json.NewDecoder(request.Body).Decode(&values)

	query := "UPDATE posts SET title = ? , content = ? , publishedAt = NOW() WHERE id = ?;"
	stmt, err := db.Prepare(query)
	if err != nil {
		log.Fatal(err)
	}
	defer stmt.Close()

	_, err = stmt.Exec(values.Title, values.Content, id)
	if err != nil {
		log.Fatal(err)
	}
	json.NewEncoder(response).Encode(values)
}

// DeletePostById deletes a post by post ID.
func DeletePostById(response http.ResponseWriter, request *http.Request) {
	params := mux.Vars(request)
	id, err := strconv.Atoi(params["id"])
	query := "DELETE FROM POSTS WHERE ID = ?;"
	_, err = db.Query(query, id)
	if err != nil {
		log.Fatal(err)
	}
	response.WriteHeader(http.StatusOK)
}

func main() {
	router := mux.NewRouter()
	router.Handle("/posts", AuthMiddleware(http.HandlerFunc(CreatePost))).Methods("POST")
	router.Handle("/posts", AuthMiddleware(http.HandlerFunc(GetAllRecentPosts))).Methods("GET")
	router.Handle("/posts/{id}", AuthMiddleware(http.HandlerFunc(GetPostById))).Methods("GET")
	router.Handle("/posts/{id}", AuthMiddleware(http.HandlerFunc(DeletePostById))).Methods("DELETE")
	router.Handle("/posts/{id}", AuthMiddleware(http.HandlerFunc(UpdatePostById))).Methods("PUT")
	router.Handle("/posts/author/{authorId}", AuthMiddleware(http.HandlerFunc(GetAllPostsByAuthorId))).Methods("GET")
	// CORS configuration
	corsHandler := cors.New(cors.Options{
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders: []string{"*"},
	}).Handler(router)
	http.Handle("/", corsHandler)
	port := "5001"
	fmt.Println("Server is running on :", port)
	http.ListenAndServe(":"+port, nil)
}
