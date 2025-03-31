package functions

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"realTimeForum/utils"
)

func Conversation(db *sql.DB, w http.ResponseWriter, r *http.Request) {
    // Set CORS headers
    w.Header().Set("Access-Control-Allow-Origin", "http://localhost:8080")
    w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
    w.Header().Set("Access-Control-Allow-Credentials", "true")
    w.Header().Set("Content-Type", "application/json")

    // Handle preflight requests
    if r.Method == http.MethodOptions {
        w.WriteHeader(http.StatusOK)
        return
    }

    if r.Method != http.MethodGet {
        utils.SendErrorResponse(w, http.StatusMethodNotAllowed, "Method not allowed")
        return
    }

    cookie, err := r.Cookie("session_id")
    if err != nil {
        utils.SendErrorResponse(w, http.StatusUnauthorized, "Missing session cookie")
        return
    }

    checkSession, userID := utils.CheckSession(db, cookie.Value)
    if !checkSession {
        utils.SendErrorResponse(w, http.StatusUnauthorized, "Invalid session")
        return
    }

    sendConversation(db, w, r, userID)
}

func sendConversation(db *sql.DB, w http.ResponseWriter, r *http.Request, userId string) {
    conversations, err := utils.GetUserConversationsWithLastMessage(db, userId)
    if err != nil {
        utils.SendErrorResponse(w, http.StatusInternalServerError, "Failed to retrieve conversations")
        return
    }

    if err := json.NewEncoder(w).Encode(conversations); err != nil {
        utils.SendErrorResponse(w, http.StatusInternalServerError, "Failed to encode conversations")
        return
    }
}