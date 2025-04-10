package utils

import (
	"database/sql"
	"log"
	"realTimeForum/models"
)

func GetCommentsByPostID(db *sql.DB, postID int, userID string) ([]models.ResponseComment, error) {
    var comments []models.ResponseComment

    rows, err := db.Query(`
        SELECT c.ID, u.USERNAME, c.CONTENT, c.CREATED_AT
        FROM COMMENT c
        JOIN USER u ON c.USERID = u.ID
        WHERE c.POST_ID = ?
        ORDER BY c.CREATED_AT ASC
    `, postID)
    if err != nil {
        log.Println("Erreur lors de la récupération des commentaires pour le post", postID, ":", err)
        return nil, err
    }
    defer rows.Close()

    for rows.Next() {
        var comment models.ResponseComment
        if err := rows.Scan(&comment.Id, &comment.User, &comment.Content, &comment.CreatedAt); err != nil {
            log.Println("Erreur lors du scan des commentaires:", err)
            return nil, err
        }
        // Initialiser les valeurs par défaut pour les likes/dislikes
        comment.Likes = 0
        comment.Dislikes = 0
        comment.Liked = false
        comment.Disliked = false
        comments = append(comments, comment)
    }

    if err = rows.Err(); err != nil {
        log.Println("Erreur lors de l'itération des commentaires:", err)
        return nil, err
    }

    return comments, nil
}