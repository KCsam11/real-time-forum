package routes

import (
	"database/sql"
	"net/http"
	"realTimeForum/chat"
	"realTimeForum/functions"
)

// Ajout de `hub *websocketFile.Hub` en paramètre
func SetupRoutes(mux *http.ServeMux, db *sql.DB, hub *chat.Hub) {
	//Routes API
	fs := http.FileServer(http.Dir("static"))
    mux.Handle("/static/", http.StripPrefix("/static/", fs))

    // API routes
    mux.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
        functions.Login(w, r, db)
    })

    mux.HandleFunc("/api/register", func(w http.ResponseWriter, r *http.Request) {
        functions.Register(w, r, db)
    })
    mux.HandleFunc("/api/logout", func(w http.ResponseWriter, r *http.Request) {
        functions.Logout(db,w,r)
    })

    mux.HandleFunc("/api/users", func(w http.ResponseWriter, r *http.Request) {
        functions.GetUsersHandler(w, r, db)
    })

    mux.HandleFunc("/api/current-user", func(w http.ResponseWriter, r *http.Request) {
        functions.GetCurrentUser(db, w, r)
    })

    mux.HandleFunc("/api/messages", func(w http.ResponseWriter, r *http.Request) {
        functions.PrivateMessage(db, w, r, hub)
    })

    mux.HandleFunc("/api/notif", func(w http.ResponseWriter, r *http.Request) {
        functions.Notification(db, w, r)
    })
    
    mux.HandleFunc("/api/conversation", func(w http.ResponseWriter, r *http.Request) {
		functions.Conversation(db, w, r)
	})

    mux.HandleFunc("/api/post", func(w http.ResponseWriter, r *http.Request) {
		functions.Post(w, r,db)
	})

    // mux.HandleFunc("/api/post/{id}", func(w http.ResponseWriter, r *http.Request) {
	// 	functions.UniquePost(db, w, r)
	// })

    // mux.HandleFunc("/api/comment", func(w http.ResponseWriter, r *http.Request) {
	// 	functions.Comment(db, w, r)
	// })
	// mux.HandleFunc("/api/comment/{id}", func(w http.ResponseWriter, r *http.Request) {
	// 	functions.Comment(db, w, r)
	// })
	mux.HandleFunc("/api/event", func(w http.ResponseWriter, r *http.Request) {
		functions.Event(db, w, r,hub)
	})

    // Serve index.html for all other routes
    mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        http.ServeFile(w, r, "static/index.html")
    })

    

    mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		hub.HandleConnections(db, w, r)
	})
}
