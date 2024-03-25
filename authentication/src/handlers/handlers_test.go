package handlers

import (
	"auth/src/utils"
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	_ "github.com/go-sql-driver/mysql"
	"github.com/stretchr/testify/assert"
)

func cleanup(email string) {
	DeleteAuthorByEmail("jane.doe@example.com")
}

func setUp(t *testing.T) {
	requestBody := []byte(`{"firstName":"jane","lastName":"Doe","mobile":"1234567890","email":"jane.doe@example.com","password":"test123"}`)
	req, err := http.NewRequest("POST", "/authors", bytes.NewBuffer(requestBody))
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/json")

	// Create a response recorder to record the handler's response
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(AddAuthor)

	// Serve the HTTP request to the handler
	handler.ServeHTTP(rr, req)
}

func TestAddAuthorHandler(t *testing.T) {
	cleanup("jane.doe@example.com")
	// Set up test environment
	os.Setenv("MY_SIGN_IN_KEY", "test_key")
	// Create a request body with JSON data
	requestBody := []byte(`{"firstName":"jane","lastName":"Doe","mobile":"1234567890","email":"jane.doe@example.com","password":"test123"}`)
	req, err := http.NewRequest("POST", "/authors", bytes.NewBuffer(requestBody))
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/json")

	// Create a response recorder to record the handler's response
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(AddAuthor)

	// Serve the HTTP request to the handler
	handler.ServeHTTP(rr, req)

	// Check the HTTP status code
	assert.Equal(t, http.StatusOK, rr.Code, "Status code should be 200 OK")

	// Check the response body for the author's email
	expectedResponse := utils.RemoveSpacesTabsNewlines("\"jane.doe@example.com\"")
	assert.Equal(t, expectedResponse, utils.RemoveSpacesTabsNewlines(rr.Body.String()), "Response body should contain the author's email")
}

func TestLoginHandler(t *testing.T) {
	// Set up test environment
	os.Setenv("MY_SIGN_IN_KEY", "test_key")
	// Create a request body with JSON data
	requestBody := []byte(`{"email":"jane.doe@example.com","password":"test123"}`)
	req, err := http.NewRequest("POST", "/login", bytes.NewBuffer(requestBody))
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/json")

	// Create a response recorder to record the handler's response
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(Login)

	// Serve the HTTP request to the handler
	handler.ServeHTTP(rr, req)

	// Check the HTTP status code
	assert.Equal(t, http.StatusOK, rr.Code, "Status code should be 200 OK")

	// Check the response body for the JWT token
	var token string
	err = json.Unmarshal(rr.Body.Bytes(), &token)
	if err != nil {
		t.Fatal(err)
	}
	assert.NotEmpty(t, token, "JWT token should not be empty")
}
