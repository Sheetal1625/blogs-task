package handlers

import (
	"blog-posts/src/database"
	"blog-posts/src/models"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

// Database Connection
var db *sql.DB = database.GetDB()

// GetAllRecentPosts retrieves all recent posts.
func GetAllRecentPosts(response http.ResponseWriter, request *http.Request) {
	defer func() {
		if r := recover(); r != nil {
			log.Printf("Recovered from panic: %v", r)
			http.Error(response, "Internal Server Error", http.StatusInternalServerError)
		}
	}()
	fmt.Printf("Request for : %s\n", request.URL.Path)
	var values models.Post
	json.NewDecoder(request.Body).Decode(&values)

	query := "SELECT * FROM POSTS ORDER BY PublishedAt DESC;"
	results, err := db.Query(query)
	var posts []models.Post
	for results.Next() {
		var temp models.Post
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
	fmt.Printf("Request for : %s\n", request.URL.Path)
	params := mux.Vars(request)
	id, err := strconv.Atoi(params["id"])
	query := "SELECT * FROM POSTS WHERE ID = ?;"
	results, err := db.Query(query, id)
	var post models.Post
	for results.Next() {
		var temp models.Post
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
	fmt.Printf("Request for : %s\n", request.URL.Path)
	params := mux.Vars(request)
	authorId, err := strconv.Atoi(params["authorId"])
	if err != nil {
		http.Error(response, "Invalid author ID", http.StatusBadRequest)
		return
	}
	query := "SELECT * FROM POSTS WHERE authorId = ?;"
	results, err := db.Query(query, authorId)
	var posts []models.Post
	for results.Next() {
		var temp models.Post
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
	fmt.Printf("Request for : %s\n", request.URL.Path)
	var values models.Post
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
	fmt.Printf("Request for : %s\n", request.URL.Path)
	params := mux.Vars(request)
	id, err := strconv.Atoi(params["id"])
	var values models.Post
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
	fmt.Printf("Request for : %s\n", request.URL.Path)
	params := mux.Vars(request)
	id, err := strconv.Atoi(params["id"])
	query := "DELETE FROM POSTS WHERE ID = ?;"
	_, err = db.Query(query, id)
	if err != nil {
		log.Fatal(err)
	}
	response.WriteHeader(http.StatusOK)
}
