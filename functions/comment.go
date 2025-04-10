package functions

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"realTimeForum/chat"
	"realTimeForum/models"
	"realTimeForum/services"
	"realTimeForum/utils"
	"strconv"
	"strings"
	"time"
)

func Comment(db *sql.DB, w http.ResponseWriter, r *http.Request, hub *chat.Hub) {
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

	switch r.Method {
	case http.MethodPost:
		if userID == "" {
			utils.SendErrorResponse(w, http.StatusUnauthorized, "Utilisateur invalide")
			return
		}
		handleCreateComment(db, w, r, userID,hub)
	case http.MethodGet:
		idStr := strings.TrimPrefix(r.URL.Path, "/api/comment/")
		postID, err := strconv.Atoi(idStr)
		if err != nil {
			utils.SendErrorResponse(w, http.StatusBadRequest, "Invalid post ID")
			return
		}
		handleComment(db, w, postID, userID)
		utils.SendErrorResponse(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

func handleCreateComment(db *sql.DB, w http.ResponseWriter, r *http.Request, userId string, hub *chat.Hub) {
    var comment models.ReceiveComment
    err := json.NewDecoder(r.Body).Decode(&comment)
    if err != nil {
        utils.SendErrorResponse(w, http.StatusBadRequest, "Format JSON invalide")
        return
    }

    if comment.Content == "" || comment.IdPost == 0 {
        utils.SendErrorResponse(w, 400, "Champs requis manquants")
        return
    }

    // Insérer le commentaire
    err = services.InsertComment(db, userId, comment.Content, comment.IdPost)
    if err != nil {
        utils.SendErrorResponse(w, http.StatusBadRequest, "Erreur d'insertion du commentaire")
        return
    }

    // Récupérer le nom de l'utilisateur qui commente
    senderName := utils.GetUsernameByID(db, userId)
    
    // Récupérer l'ID du propriétaire du post
    var postOwnerID string
    err = db.QueryRow("SELECT USER_ID FROM POST WHERE ID = ?", comment.IdPost).Scan(&postOwnerID)
    if err != nil {
        utils.SendErrorResponse(w, http.StatusInternalServerError, "Erreur lors de la récupération du propriétaire du post")
        return
    }

    // Préparer le contenu de la notification
    notifType := "comment"
    notifContent := fmt.Sprintf("%s a commenté votre post", senderName)

    // Créer la notification en base de données
    err = utils.InsertNotification(db, postOwnerID, userId, notifType, comment.IdPost, notifContent)
    if err != nil {
        log.Printf("⚠️ Erreur création notification: %v", err)
    }

    // Récupérer l'ID de la notification
    IdNotif, err := utils.GetLastNotificationID(db, postOwnerID, userId)
    if err != nil {
        log.Printf("⚠️ Erreur récupération ID notification: %v", err)
    }

    // Créer l'objet notification
    notification := models.Notification{
        Id:         IdNotif,
        ReceiverID: postOwnerID,
        SenderID:   senderName,
        Type:       notifType,
        Content:    notifContent,
        RelatedID:  comment.IdPost,
        Status:     "unread",
    }

    // Envoyer la notification via WebSocket
    receiverUsername := utils.GetUsernameByID(db, postOwnerID)
    hub.SendNotificationMessage(notification, receiverUsername)

    // Préparer la réponse HTTP
    response := map[string]interface{}{
        "success":    true,
        "username":   senderName,
        "content":    comment.Content,
        "created_at": time.Now(),
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
}

func handleComment(db *sql.DB, w http.ResponseWriter, postID int, userID string) {
	// Récupérer les commentaires depuis la base de données
	comments, err := utils.GetCommentsByPostID(db, postID, userID)
	if err != nil {
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Error retrieving comments")
		return
	}

	// Retourner les commentaires sous forme de JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(comments)
}
