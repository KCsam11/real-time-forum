package chat

import (
	"encoding/json"
	"realTimeForum/models"

	"github.com/gorilla/websocket"
)

func (h *Hub) SendNotificationMessage(notif models.Notification, username string) {
	// Construire le message de notification
	notification := models.Message{
		Type: "notification",
		Notification: notif,
	}

	// Sérialiser en JSON
	message, err := json.Marshal(notification)
	if err != nil {
		return
	}

	// Parcourir les clients connectés et envoyer la notification au bon utilisateur
	h.mu.Lock()
	defer h.mu.Unlock()
	for conn, user := range h.clients {
		if user == username {
			if err := conn.WriteMessage(websocket.TextMessage, message); err != nil {
				// En cas d'erreur, fermer la connexion et la retirer
				conn.Close()
				delete(h.clients, conn)
			}
		}
	}
}
