package main

import (
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func ForwardRequest(response http.ResponseWriter, request *http.Request) {
	client := &http.Client{}

	// Modify the request URL based on the prefix
	if strings.HasPrefix(request.URL.Path, "/posts") {
		fmt.Println("Redirecting to Blogs Services !!!")
		request.URL.Scheme = "http"
		request.URL.Host = "localhost:5001"
	} else {
		fmt.Println("Redirecting to Auth Services !!!")
		request.URL.Scheme = "http"
		request.URL.Host = "localhost:5002"
	}
	fmt.Println(request.URL.String())

	// Create a new request with the modified URL and headers
	newreq, err := http.NewRequest(request.Method, request.URL.String(), request.Body)
	if err != nil {
		fmt.Println("client: could not create request:\n", err)
		http.Error(response, "Bad Request", http.StatusBadRequest)
		return
	}
	newreq.Header.Set("Authorization", request.Header.Get("Authorization"))

	// Send the request to the target service
	resp, err := client.Do(newreq)
	if err != nil {
		http.Error(response, "Server Error", http.StatusInternalServerError)
		fmt.Println("ServeHTTP:", err)
		return
	}
	defer resp.Body.Close()

	// Copy the response headers and body to the gateway response
	for key, values := range resp.Header {
		for _, value := range values {
			response.Header().Add(key, value)
		}
	}
	response.WriteHeader(resp.StatusCode)
	io.Copy(response, resp.Body)
}

func main() {
	router := mux.NewRouter()

	// Define your main handler function
	mainHandler := http.HandlerFunc(ForwardRequest)

	// Route all requests to the main handler
	router.PathPrefix("/").Handler(mainHandler)
	corsHandler := cors.New(cors.Options{
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders: []string{"*"},
	}).Handler(router)
	http.Handle("/", corsHandler)
	port := "8000"
	fmt.Println("Server is running on :", port)
	http.ListenAndServe(":"+port, nil)
}
