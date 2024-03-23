# Go Project with JWT Authentication and Gorilla Mux Router

This project is a Go application that includes JWT authentication middleware, HTTP route handling using the Gorilla mux router, and CORS configuration.

## Installation

1. Make sure you have Go installed on your system. You can download it from [here](https://golang.org/dl/).

2. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/Sheetal1625/blogs-task.git

   ```

3. Navigate to the project directory:

   cd blogs-task

4. Install the required dependencies using Go modules:

   go mod tidy

# Configuration

1. Update the database connection string (dsn) in the main.go file with your MySQL database credentials and details.

2. Update the JWT signing key (mySignInKey) in the main.go file with a secure key for JWT token generation and validation.

The server will start running on port 5001 by default.

# API Endpoints

1. POST /api/author: Add a new author.
2. POST /api/auth: Author login to generate JWT token.
