package functions

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"realTimeForum/models"
	"realTimeForum/utils"
)

func GetCurrentUser(db *sql.DB, w http.ResponseWriter, r *http.Request) {
    // Set response headers first
    w.Header().Set("Content-Type", "application/json")
    w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3123")
    w.Header().Set("Access-Control-Allow-Credentials", "true")

	if r.Method == "OPTIONS" {
        w.WriteHeader(http.StatusOK)
        return
    }

	// Force Content-Type to application/json
    w.Header().Set("Content-Type", "application/json")

    // Check if this is an API request
    if r.URL.Path != "/api/current-user" {
        utils.SendErrorResponse(w, http.StatusNotFound, "Not found")
        return
    }

    // Vérifier si la méthode est GET
    if r.Method != http.MethodGet {
        utils.SendErrorResponse(w, http.StatusMethodNotAllowed, "Method not allowed")
        return
    }

    // Récupérer le cookie de session
    cookie, err := r.Cookie("session_id")
    if err != nil {
        utils.SendErrorResponse(w, http.StatusUnauthorized, "Missing cookie")
        return
    }

    // Vérifier la session
    checkSession, userID := utils.CheckSession(db, cookie.Value)
    if !checkSession {
        utils.SendErrorResponse(w, http.StatusUnauthorized, "Session invalid")
        return
    }

	var user models.User
    query := `
        SELECT ID, EMAIL, USERNAME, CREATED_AT
        FROM USER
        WHERE ID = ?`
    
    
    err = db.QueryRow(query, userID).Scan(&user.ID, &user.Email, &user.Username, &user.CreatedAt)
    if err != nil {
        log.Printf("Database error: %v", err)
        if err == sql.ErrNoRows {
            utils.SendErrorResponse(w, http.StatusNotFound, "User not found")
            return
        }
        utils.SendErrorResponse(w, http.StatusInternalServerError, "Failed to retrieve user")
        return
    }

   response := map[string]interface{}{
        "status": "success",
        "data": map[string]interface{}{
            "ID":         user.ID,
            "EMAIL":      user.Email,
            "USERNAME":   user.Username,
            "CREATED_AT": user.CreatedAt,
        },
    }

    // Encode and send response
    if err := json.NewEncoder(w).Encode(response); err != nil {
        log.Printf("JSON encoding error: %v", err)
        utils.SendErrorResponse(w, http.StatusInternalServerError, "Failed to encode response")
        return
    }
}