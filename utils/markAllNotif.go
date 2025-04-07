package utils

import (
	"database/sql"
	"log"
)

// MarkAllNotification met à jour toutes les notifications non lues d'un utilisateur
func MarkAllNotification(db *sql.DB, userId string) error {
    // Préparer la requête pour mettre à jour toutes les notifications
    query := `
        UPDATE NOTIFICATION 
        SET STATUS = 'read' 
        WHERE RECEIVER_ID = ? 
        AND STATUS = 'unread'`

    // Exécuter la requête
    result, err := db.Exec(query, userId)
    if err != nil {
        log.Printf("❌ Erreur lors de la mise à jour des notifications: %v", err)
        return err
    }

    // Vérifier combien de lignes ont été affectées
    rows, err := result.RowsAffected()
    if err != nil {
        log.Printf("❌ Erreur lors de la récupération des lignes affectées: %v", err)
        return err
    }

    log.Printf("✅ %d notifications marquées comme lues pour l'utilisateur %s", rows, userId)
    return nil
}