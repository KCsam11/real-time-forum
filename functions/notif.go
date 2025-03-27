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
	Id int `json:"id"`
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
    w.Header().Set("Access-Control-Allow-Origin", "http://localhost:8080")
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
	var read ReadNotification
	err := json.NewDecoder(r.Body).Decode(&read)
	if err != nil {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Error lors du décodage des données ")
		return
	}

	err = utils.ReadNotification(db, userId, read.Id)
	if err != nil {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Error lors de la récupération des données")
		return
	}

	w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    // Envoyer une réponse JSON de succès
    json.NewEncoder(w).Encode(map[string]string{
        "status": "success",
        "message": "Notification marquée comme lue",
    })
}
