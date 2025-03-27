package utils

import (
	"database/sql"
	"log"
)
func InsertNotification(db *sql.DB, receiverID, senderID, notifType string, relatedID int, content string) error {
    log.Printf("📥 Tentative insertion notification - Receiver: %s, Sender: %s, Type: %s", 
        receiverID, senderID, notifType)

    query := `
        INSERT INTO NOTIFICATION (
            RECEIVER_ID, SENDER_ID, TYPE, RELATED_ID, CONTENT, STATUS
        ) VALUES (?, ?, ?, ?, ?, 'unread')
    `
    
    result, err := db.Exec(query, receiverID, senderID, notifType, relatedID, content)
    if err != nil {
        log.Printf("❌ Erreur SQL: %v\nQuery: %s\nParams: %v", err, query, 
            []interface{}{receiverID, senderID, notifType, relatedID, content})
        return err
    }

    id, err := result.LastInsertId()
    if err != nil {
        log.Printf("❌ Erreur récupération LastInsertId: %v", err)
        return err
    }

    log.Printf("✅ Notification insérée avec ID: %d", id)
    return nil
}