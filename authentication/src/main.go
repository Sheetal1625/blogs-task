package main

import (
	"auth/src/handlers"
	"fmt"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	// Create a new router using github.com/gorilla/mux
	router := mux.NewRouter()

	// Define HTTP routes for adding an author and author login
	router.HandleFunc("/auth/register", handlers.AddAuthor).Methods("POST")
	router.HandleFunc("/auth/login", handlers.Login).Methods("POST")
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
