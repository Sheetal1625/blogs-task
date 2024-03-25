package models

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
