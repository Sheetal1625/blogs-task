package handlers

import (
	"blog-posts/src/models"
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	_ "github.com/go-sql-driver/mysql"
)

func TestCreatePost(t *testing.T) {
	// //database.SetupTestDB()
	postData := models.Post{
		AuthorId:    1,
		Title:       "Test Post",
		Content:     "This is a test post",
		PublishedAt: "2024-03-25 12:00:00",
	}
	postJSON, err := json.Marshal(postData)
	if err != nil {
		t.Fatal(err)
	}
	req, err := http.NewRequest("POST", "/posts", bytes.NewBuffer(postJSON))
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(CreatePost)
	handler.ServeHTTP(rr, req)
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}
	var createdPost models.Post
	err = json.NewDecoder(rr.Body).Decode(&createdPost)
	if err != nil {
		t.Fatal(err)
	}
	if createdPost.Title != postData.Title {
		t.Errorf("handler returned unexpected post title: got %v want %v",
			createdPost.Title, postData.Title)
	}
}

func TestUpdatePostById(t *testing.T) {
	postData := models.Post{
		Title:   "Updated Test Post",
		Content: "This is an updated test post",
	}
	postJSON, err := json.Marshal(postData)
	if err != nil {
		t.Fatal(err)
	}
	req, err := http.NewRequest("PUT", "/posts/1", bytes.NewBuffer(postJSON))
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(UpdatePostById)
	handler.ServeHTTP(rr, req)
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}
}

func TestDeletePostById(t *testing.T) {
	req, err := http.NewRequest("DELETE", "/posts/1", nil)
	if err != nil {
		t.Fatal(err)
	}
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(DeletePostById)
	handler.ServeHTTP(rr, req)
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}
}
