package main

import (
	"database/sql"
	"log"
	"net/http"
	"realTimeForum/chat"
	"realTimeForum/database"
	"realTimeForum/routes"
	"strings"

	_ "github.com/mattn/go-sqlite3"
)

// Middleware CORS
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Configuration des en-têtes CORS
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Pour les requêtes OPTIONS, on répond sans exécuter le handler suivant
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Appel au prochain middleware ou handler
		next.ServeHTTP(w, r)
	})
}

func main() {
	_,err := database.InitDB()
	if err != nil {
        log.Fatalf("Erreur d'initialisation de la base de données : %v", err)
    }
    
	db, err := sql.Open("sqlite3", "./database/db.db")
	if err != nil {
		log.Fatalf("Erreur de connexion à la base de données : %v", err)
	}
	defer func(db *sql.DB) {
		err := db.Close()
		if err != nil {

		}
	}(db)

	hub := chat.NewHub(db)
	go hub.Run()

	mux := http.NewServeMux()

	routes.SetupRoutes(mux, db,hub) // On passe `db`
	
	fs := http.FileServer(http.Dir("static"))
    http.Handle("/static/", http.StripPrefix("/static/", fs))
    
    // La route pour index.html doit être la dernière
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        // Ne pas servir index.html pour les routes API
        if strings.HasPrefix(r.URL.Path, "/api/") {
            http.NotFound(w, r)
            return
        }
        http.ServeFile(w, r, "static/index.html")
    })

	// Ajout du middleware CORS
	handlerWithCORS := corsMiddleware(mux)

	log.Println("Serveur démarré sur le port http://217.154.67.147:3123")
	log.Fatal(http.ListenAndServe(":3123", handlerWithCORS))
}
