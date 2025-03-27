package utils

import (
	"database/sql"
	"log"
)

func GetUsernameByID(db *sql.DB, userID string) string {
    var username string
    err := db.QueryRow(`
        SELECT USERNAME 
        FROM USER 
        WHERE ID = ?
    `, userID).Scan(&username)

    if err != nil {
        if err == sql.ErrNoRows {
            log.Printf("❌ Aucun utilisateur trouvé avec l'ID: %s", userID)
            return ""
        }
        log.Printf("❌ Erreur lors de la récupération du username: %v", err)
        return ""
    }

    return username
}