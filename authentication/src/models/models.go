package models

// Author struct represents author details
type Author struct {
	ID         int    `json:"id"`
	FirstName  string `json:"firstName"`
	MiddleName string `json:"middleName"`
	LastName   string `json:"lastName"`
	Mobile     string `json:"mobile`
	Email      string `json:"email`
	Password   string `json:"password`
}

// Credential struct represents login credentials
type Credential struct {
	Email    string `json:"email`
	Password string `json:"password"`
}
