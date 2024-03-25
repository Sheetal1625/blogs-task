package main

import (
	"blog-posts/src/handlers"
	"blog-posts/src/middlewares"
	"fmt"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	router := mux.NewRouter()
	router.Handle("/posts", middlewares.AuthMiddleware(http.HandlerFunc(handlers.CreatePost))).Methods("POST")
	router.Handle("/posts", middlewares.AuthMiddleware(http.HandlerFunc(handlers.GetAllRecentPosts))).Methods("GET")
	router.Handle("/posts/{id}", middlewares.AuthMiddleware(http.HandlerFunc(handlers.GetPostById))).Methods("GET")
	router.Handle("/posts/{id}", middlewares.AuthMiddleware(http.HandlerFunc(handlers.DeletePostById))).Methods("DELETE")
	router.Handle("/posts/{id}", middlewares.AuthMiddleware(http.HandlerFunc(handlers.UpdatePostById))).Methods("PUT")
	router.Handle("/posts/author/{authorId}", middlewares.AuthMiddleware(http.HandlerFunc(handlers.GetAllPostsByAuthorId))).Methods("GET")
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
