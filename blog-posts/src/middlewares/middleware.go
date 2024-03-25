package middlewares

import (
	"net/http"
	"os"
	"strings"

	"github.com/dgrijalva/jwt-go"
)

// JWT signing key.
var secretKey string = os.Getenv("MY_SIGN_IN_KEY")

// AuthMiddleware is JWT token validation middleware.
func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
		authHeader := request.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(response, "Authorization header is missing", http.StatusUnauthorized)
			return
		}

		tokenString := strings.Replace(authHeader, "Bearer ", "", 1)

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return []byte(secretKey), nil
		})

		if err != nil || !token.Valid {
			http.Error(response, "Invalid or expired token", http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(response, request)
	})
}
