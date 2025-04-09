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

type ReceiveEvent struct {
	Type        string `json:"type"`         //comment or post
	ContentType string `json:"content_type"` // like dislikec
	Id          int    `json:"id"`           // ID post
}
type PostState struct {
    Liked    bool `json:"liked"`
    Disliked bool `json:"disliked"`
    Likes    int  `json:"likes"`
    Dislikes int  `json:"dislikes"`
}

func Event(db *sql.DB, w http.ResponseWriter, r *http.Request, hub *chat.Hub) {
    if r.Method != http.MethodPost {
        utils.SendErrorResponse(w, http.StatusMethodNotAllowed, "Méthode non autorisée")
        return
    }

    cookie, err := r.Cookie("session_id")
    if err != nil {
        utils.SendErrorResponse(w, http.StatusUnauthorized, "Cookie manquant")
        return
    }

    checkSession, userID := utils.CheckSession(db, cookie.Value)
    if !checkSession {
        utils.SendErrorResponse(w, http.StatusUnauthorized, "Session invalide")
        return
    }

    var event ReceiveEvent
    err = json.NewDecoder(r.Body).Decode(&event)
    if err != nil {
        fmt.Printf("Erreur de parsing JSON: %v\n", err)
        utils.SendErrorResponse(w, http.StatusBadRequest, "Erreur de parsing du JSON")
        return
    }

    // Log des données reçues
    fmt.Printf("Event reçu: %+v\n", event)

    if event.Id <= 0 {
        utils.SendErrorResponse(w, http.StatusBadRequest, "ID invalide")
        return
    }

    // Validation du type et content_type
    if event.Type == "" {
        utils.SendErrorResponse(w, http.StatusBadRequest, "Type d'événement manquant")
        return
    }

    if event.ContentType == "" {
        utils.SendErrorResponse(w, http.StatusBadRequest, "Content type manquant")
        return
    }

    switch event.Type {
    case "comment":
        handleCommentEvent(db, w, userID, event)
        return
    case "post":
        handlePostEvent(db, w, userID, event, hub)
        return
    default:
        utils.SendErrorResponse(w, http.StatusBadRequest, "Type d'événement inconnu: "+event.Type)
        return
    }
}

func handleCommentEvent(db *sql.DB, w http.ResponseWriter, userID string, event ReceiveEvent) {
	// var err error

	// switch event.ContentType {
	// case "like":
	// 	err = services.CommentEventLike(db, userID, event.Id)
	// 	if err != nil {
	// 		utils.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
	// 		return
	// 	}
	// 	err = services.CreateNotification(db, userID, "like_comment", event.Id)
	// case "dislike":
	// 	err = services.CommentEventDislike(db, userID, event.Id)
	// 	if err != nil {
	// 		utils.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
	// 		return
	// 	}
	// 	err = services.CreateNotification(db, userID, "dislike_comment", event.Id)
	// default:
	// 	utils.SendErrorResponse(w, http.StatusBadRequest, "Unknown event type")
	// 	return
	// }

	// if err != nil {
	// 	utils.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
	// 	return
	// }

	// w.WriteHeader(http.StatusOK)
}

func handlePostEvent(db *sql.DB, w http.ResponseWriter, userID string, event ReceiveEvent, hub *chat.Hub) {
	var err error
    var notifType string
    var notifContent string


    switch event.ContentType {
    case "get_state":
        handleStateEvent(db, w, userID, event)
        return
    case "like":
        err = services.InsertPostLike(db, userID, event.Id)
        if err != nil {
            utils.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
            return
        }  
        notifType = "like"
        senderName := utils.GetUsernameByID(db, userID)
        notifContent = fmt.Sprintf("%s a aimé votre post", senderName)
    case "dislike":
        err = services.InsertPostDislike(db, userID, event.Id)
        if err != nil {
            utils.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
            return
        }
        notifType = "dislike"
        senderName := utils.GetUsernameByID(db, userID)
        notifContent = fmt.Sprintf("%s n'a pas aimé votre post", senderName)

    default:
        utils.SendErrorResponse(w, http.StatusBadRequest, "Unknown event type")
        return
    }

    // err = services.CreateNotification(db, userID, notifType, event.Id)
    // if err != nil {
	// 	utils.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
	// 	return
	// }

     // Get post owner's ID
     var postOwnerID string
     err = db.QueryRow("SELECT USER_ID FROM POST WHERE ID = ?", event.Id).Scan(&postOwnerID)
     if err != nil {
         utils.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
         return
     }
 
     // Create notification
     err = utils.InsertNotification(db, postOwnerID, userID, notifType, event.Id, notifContent)
     if err != nil {
         log.Printf("⚠️ Erreur création notification: %v", err)
     }
 
     // Get notification ID
     IdNotif, err := utils.GetLastNotificationID(db, postOwnerID, userID)
     if err != nil {
         log.Printf("⚠️ Erreur récupération ID notification: %v", err)
     }
 
     // Create notification object
     notification := models.Notification{
         Id:         IdNotif,
         ReceiverID: postOwnerID,
         SenderID:   utils.GetUsernameByID(db, userID),
         Type:       notifType,
         Content:    notifContent,
         RelatedID:  event.Id,
         Status:     "unread",
     }
 
    // Send notification through WebSocket
    receiverUsername := utils.GetUsernameByID(db, postOwnerID)
    hub.SendNotificationMessage(notification, receiverUsername)
	w.WriteHeader(http.StatusOK)
}

// Corriger handleStateEvent pour gérer correctement l'état
func handleStateEvent(db *sql.DB, w http.ResponseWriter, userID string, event ReceiveEvent) {
    var state PostState  
    
    // Vérifier si l'utilisateur a déjà liké
    var hasLiked int
    err := db.QueryRow(`
        SELECT COUNT(*) 
        FROM LIKES 
        WHERE USER_ID = ? AND POST_ID = ?`, 
        userID, event.Id).Scan(&hasLiked)
    
    if err != nil {
        utils.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
        return
    }
    state.Liked = hasLiked > 0

    // Vérifier si l'utilisateur a déjà disliké
    var hasDisliked int
    err = db.QueryRow(`
        SELECT COUNT(*) 
        FROM DISLIKE 
        WHERE USER_ID = ? AND POST_ID = ?`, 
        userID, event.Id).Scan(&hasDisliked)
    
    if err != nil {
        utils.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
        return
    }
    state.Disliked = hasDisliked > 0

    // Obtenir le nombre total de likes et dislikes
    var likes, dislikes int
    err = db.QueryRow(`
        SELECT 
            (SELECT COUNT(*) FROM LIKES WHERE POST_ID = ?),
            (SELECT COUNT(*) FROM DISLIKE WHERE POST_ID = ?)
        `, event.Id, event.Id).Scan(&likes, &dislikes)

    if err != nil {
        utils.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
        return
    }
    state.Likes = likes
    state.Dislikes = dislikes

    w.Header().Set("Content-Type", "application/json")
    if err := json.NewEncoder(w).Encode(state); err != nil {
        utils.SendErrorResponse(w, http.StatusInternalServerError, "Erreur lors de l'encodage de la réponse")
        return
    }
}