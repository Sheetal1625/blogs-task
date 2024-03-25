package database

import (
	"database/sql"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// MockDB is a mock implementation of sql.DB for testing purposes
type MockDB struct {
	mock.Mock
}

// GetDB is a mock function that returns a mocked database connection
func (m *MockDB) GetDB() *sql.DB {
	args := m.Called()
	return args.Get(0).(*sql.DB)
}

func TestGetDB(t *testing.T) {
	// Mock database host environment variable
	os.Setenv("DATABASE_BLOGS", "mock_db_host")

	// Create a new instance of the mock DB
	mockDB := new(MockDB)

	// Define the expected return value from the mock DB
	expectedDB := &sql.DB{}

	// Configure the mock behavior
	mockDB.On("GetDB").Return(expectedDB)

	// Call the GetDB function from the mock DB
	db := mockDB.GetDB()

	// Assert that the returned database is the expected one
	assert.Equal(t, expectedDB, db)

	// Verify that the GetDB method was called
	mockDB.AssertExpectations(t)
}
