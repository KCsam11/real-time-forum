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
)

type GetConversation struct {
	Username string `json:"username"`
}

func PrivateMessage(db *sql.DB, w http.ResponseWriter, r *http.Request, hub *chat.Hub) {
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
	case http.MethodGet:
		handleGetMessage(db, w, r, userID)
	case http.MethodPost:
		handleCreateMessage(db, w, r, userID, hub)

	default:
		utils.SendErrorResponse(w, http.StatusMethodNotAllowed, "Method Not Allowed")
	}


}

func handleCreateMessage(db *sql.DB, w http.ResponseWriter, r *http.Request, userId string, hub *chat.Hub) {
	var messageStruc models.PrivateMessageReceived

	// Décodage du JSON reçu
	err := json.NewDecoder(r.Body).Decode(&messageStruc)
	if err != nil {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Format JSON invalide pour l'envoi du message")
		return
	}

	// Vérifier que le message et le destinataire ne sont pas vides
	if messageStruc.Message == "" || messageStruc.Receiver == "" {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Le message et le destinataire sont obligatoires")
		return
	}

	// Récupérer l'ID du destinataire à partir de son username
	userId2 := utils.GetUserIDbyUsername(db, messageStruc.Receiver)
	if userId2 == "" {
		utils.SendErrorResponse(w, http.StatusNotFound, "Utilisateur destinataire non trouvé")
		return
	}

	// Vérifier / Créer une conversation entre les deux utilisateurs
	convId, err := services.InsertNewConv(db, userId, userId2)
	if err != nil {
		log.Println("Erreur lors de la récupération/création de la conversation :", err)
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Erreur interne lors de la gestion de la conversation")
		return
	}

	// Insérer le message dans la conversation
	messageId, err := services.InsertNewMessage(db, convId, userId, messageStruc.Message)
	if err != nil {
		log.Println("Erreur lors de l'insertion du message :", err)
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Erreur interne lors de l'envoi du message")
		return
	}
	
	// Créer la notification
	notifContent := fmt.Sprintf("Nouveau message de %s", messageStruc.Receiver)
	err = utils.InsertNotification(db, userId2, userId, "message", int(messageId), notifContent)
	if err != nil {
		log.Printf("⚠️ Erreur création notification: %v", err)
	}
	
	IdNotif, err := utils.GetLastNotificationID(db, userId2, userId)

	if err != nil {
		log.Printf("⚠️ Erreur création notification: %v", err)
	}

	hub.BroadcastPrivateMessage(db, messageStruc.Message, userId, userId2)
	
	senderName := utils.GetUsernameByID(db, userId)


	 // Notifier le client
	 notification := models.Notification{
		Id:        IdNotif,
		ReceiverID: userId2,
		SenderID:  senderName,
		Type:      "message",
		Content:   notifContent,
		RelatedID: int(messageId),
		Status:    "unread",
	}
	hub.SendNotificationMessage(notification, messageStruc.Receiver)

	// Répondre avec l'ID du message inséré
	response := map[string]interface{}{
		"message":         "Message envoyé avec succès",
		"message_id":      messageId,
		"conversation_id": convId,
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func handleGetMessage(db *sql.DB, w http.ResponseWriter, r *http.Request, userId string) {
	// Récupérer le paramètre "username" depuis l'URL (ex: /message?username=KCSam)
	username := r.URL.Query().Get("user")
	if username == "" {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Le paramètre 'username' est requis")
		return
	}

	// Récupérer l'ID de l'utilisateur cible à partir du username
	getUserId := utils.GetUserIDbyUsername(db, username)
	if getUserId == "" {
		utils.SendErrorResponse(w, http.StatusNotFound, "Utilisateur introuvable")
		return
	}

	// Vérifier / Récupérer la conversation entre les deux utilisateurs
	convId, err := services.InsertNewConv(db, getUserId, userId)
	if err != nil {
		log.Println("Erreur lors de la récupération de la conversation :", err)
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Erreur lors de la récupération de la conversation")
		return
	}

	if convId == "" {
		utils.SendErrorResponse(w, http.StatusNotFound, "Aucune conversation trouvée avec cet utilisateur")
		return
	}

	// Récupérer tous les messages de la conversation
	getAllMessages, err := utils.GetAllMessage(db, convId)
	if err != nil {
		log.Println("Erreur lors de la récupération des messages :", err)
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Erreur lors de la récupération des messages")
		return
	}

	// Envoyer les messages en réponse
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(getAllMessages)
}
