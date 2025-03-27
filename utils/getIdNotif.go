package utils

import (
	"database/sql"
	"log"
)

func GetLastNotificationID(db *sql.DB, receiverID string, senderID string) (int, error) {
    var notificationID int
    err := db.QueryRow(`
        SELECT ID 
        FROM NOTIFICATION 
        WHERE RECEIVER_ID = ? 
        AND SENDER_ID = ?
        ORDER BY CREATED_AT DESC 
        LIMIT 1
    `, receiverID, senderID).Scan(&notificationID)

    if err != nil {
        if err == sql.ErrNoRows {
            log.Printf("❌ Aucune notification trouvée pour receiver_id=%s et sender_id=%s", receiverID, senderID)
            return 0, nil
        }
        log.Printf("❌ Erreur lors de la récupération de l'ID de notification: %v", err)
        return 0, err
    }

    return notificationID, nil
}