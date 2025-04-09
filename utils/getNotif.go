package utils

import (
	"database/sql"
	"log"
	"realTimeForum/models"
	"strings"
)

func GetNotification(db *sql.DB, userID string) ([]models.GetNotification, error) {
    var notifications []models.GetNotification


    rows, err := db.Query(`
        SELECT 
            n.ID,
            u.USERNAME,
            n.TYPE,
            n.RELATED_ID,
            n.STATUS,
            n.CREATED_AT
        FROM NOTIFICATION n
        JOIN USER u ON n.SENDER_ID = u.ID
        WHERE n.RECEIVER_ID = ? 
        AND TRIM(LOWER(n.STATUS)) = TRIM(LOWER(?))
        ORDER BY n.CREATED_AT DESC
    `, userID, "unread") // Changed to check for not "read"
    
    if err != nil {
        log.Printf("❌ Query error: %v", err)
        return nil, err
    }
    defer rows.Close()

    for rows.Next() {
        var notification models.GetNotification
        err := rows.Scan(
            &notification.Id,
            &notification.Sender,
            &notification.Type,
            &notification.RelatedId,
            &notification.Status,
            &notification.CreatedAt,
        )
        if err != nil {
            log.Printf("❌ Scan error: %v", err)
            return nil, err
        }
        
        // // Debug: Print raw status
        // log.Printf("Raw Status: '%s'", notification.Status)

        // Add notification if status is not "read"
        if !strings.EqualFold(strings.TrimSpace(notification.Status), "read") {
            notifications = append(notifications, notification)
        }
    }

    if err = rows.Err(); err != nil {
        log.Printf("❌ Iteration error: %v", err)
        return nil, err
    }

    return notifications, nil
}