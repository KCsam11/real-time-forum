package functions

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"realTimeForum/models"
	"realTimeForum/utils"
)

type ReadNotification struct {
	Id int `json:"notification_id"`
    MarkAll bool `json:"mark_all"`
}

func Notification(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("session_id")
	if err != nil {
		utils.SendErrorResponse(w, http.StatusUnauthorized, "Missing cookie")
		return
	}
	checkSession, userID := utils.CheckSession(db, cookie.Value)
	if !checkSession {
		utils.SendErrorResponse(w, http.StatusUnauthorized, "Session invalid")
		return
	}

	if userID == "" {
		utils.SendErrorResponse(w, http.StatusUnauthorized, "Utilisateur invalide")
		return
	}

    
	switch r.Method {
	case http.MethodGet:
		handleNotification(db, w, r, userID)
	case http.MethodPost:
		handleReadedNotification(db, w, r, userID)
	default:
		utils.SendErrorResponse(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

func handleNotification(db *sql.DB, w http.ResponseWriter, r *http.Request, userId string) {
    // Set cache control headers
    w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
    w.Header().Set("Pragma", "no-cache")
    w.Header().Set("Expires", "0")
    
    // Set content type and CORS headers
    w.Header().Set("Content-Type", "application/json")
    w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3123")
    w.Header().Set("Access-Control-Allow-Credentials", "true")
    w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	notifications, err := utils.GetNotification(db, userId)
    if err != nil {
        log.Printf("Erreur GetNotification: %v", err)
        json.NewEncoder(w).Encode(map[string]interface{}{
            "notifications": []interface{}{},
            "message": "Erreur lors de la récupération des données",
            "error": true,
        })
        return
    }

    // Ensure notifications is never nil
    if notifications == nil {
        notifications = []models.GetNotification{}
    }

    // Create response
    response := map[string]interface{}{
        "notifications": notifications,
        "message": "Aucune notification",
        "count": len(notifications),
    }

    if len(notifications) > 0 {
        response["message"] = "Notifications récupérées"
    }

    // Send response
    if err := json.NewEncoder(w).Encode(response); err != nil {
        log.Printf("Erreur encodage JSON: %v", err)
        json.NewEncoder(w).Encode(map[string]interface{}{
            "notifications": []interface{}{},
            "message": "Erreur lors de l'encodage des données",
            "error": true,
        })
        return
    }

}



func handleReadedNotification(db *sql.DB, w http.ResponseWriter, r *http.Request, userId string) {
    // Set headers first
    w.Header().Set("Content-Type", "application/json")
    w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3123")
    w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
    w.Header().Set("Access-Control-Allow-Credentials", "true")

    // Check content type
    if r.Header.Get("Content-Type") != "application/json" {
        utils.SendErrorResponse(w, http.StatusBadRequest, "Content-Type must be application/json")
        return
    }

    // Read body
    var read ReadNotification
    err := json.NewDecoder(r.Body).Decode(&read)
    if err != nil {
        log.Printf("❌ JSON decode error: %v", err)
        utils.SendErrorResponse(w, http.StatusBadRequest, "Invalid JSON format")
        return
    }

    // Validate request data
    if !read.MarkAll && read.Id < 0 {
        utils.SendErrorResponse(w, http.StatusBadRequest, "Invalid notification ID")
        return
    }

    // Process the notification
    if read.MarkAll {
        log.Printf("🔄 Marking all notifications as read for user: %s", userId)
        err = utils.MarkAllNotification(db, userId)
    } else {
        log.Printf("🔄 Marking notification %d as read for user: %s", read.Id, userId)
        err = utils.ReadNotification(db, userId, read.Id)
    }

    if err != nil {
        log.Printf("❌ Update error: %v", err)
        utils.SendErrorResponse(w, http.StatusInternalServerError, "Error updating notifications")
        return
    }

    // Send success response
    json.NewEncoder(w).Encode(map[string]string{
        "status": "success",
        "message": "Notification marked as read",
    })
}