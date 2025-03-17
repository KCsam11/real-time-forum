package routes

import (
	"database/sql"
	"net/http"

	"realTimeForum/functions"
)

// Ajout de `hub *websocketFile.Hub` en paramètre
func SetupRoutes(mux *http.ServeMux, db *sql.DB) {
	//Routes API
	mux.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		functions.Login(w, r, db)
	// })
	// mux.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {
	// 	functions.Register(w, r, db)
	// })
	// mux.HandleFunc("/post", func(w http.ResponseWriter, r *http.Request) {
	// 	functions.Post(w, r, db)
	// })
	// mux.HandleFunc("/post/{id}", func(w http.ResponseWriter, r *http.Request) {
	// 	functions.UniquePost(db, w, r)
	// })
	// mux.HandleFunc("/logout", func(w http.ResponseWriter, r *http.Request) {
	// 	functions.Logout(db, w, r)
	// })
	// mux.HandleFunc("/message", func(w http.ResponseWriter, r *http.Request) {
	// 	functions.PrivateMessage(db, w, r, hub)
	// })
	// mux.HandleFunc("/comment", func(w http.ResponseWriter, r *http.Request) {
	// 	functions.Comment(db, w, r)
	// })
	// mux.HandleFunc("/comment/{id}", func(w http.ResponseWriter, r *http.Request) {
	// 	functions.Comment(db, w, r)
	// })
	// mux.HandleFunc("/event", func(w http.ResponseWriter, r *http.Request) {
	// 	functions.Event(db, w, r)
	// })
	// mux.HandleFunc("/notification", func(w http.ResponseWriter, r *http.Request) {
	// 	functions.Notification(db, w, r)
	// })

	// mux.HandleFunc("/conversation", func(w http.ResponseWriter, r *http.Request) {
	// 	functions.Conversation(db, w, r)
	// })

	//Chargement des fichiers statics (HTML, CSS, JS)
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "../templates/index.html")
	})
	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("../templates/static"))))

	// // Route WebSocket corrigée avec `hub`
	// mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
	// 	hub.HandleConnections(db, w, r)
	// })
})
}
