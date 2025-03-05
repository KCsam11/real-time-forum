package main

import (
	"log"
	"net/http"
	"realTimeForum/database"

	_ "github.com/mattn/go-sqlite3"
)
func main() {
    db, err := database.InitDB()
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

      // Servir les fichiers statiques
      fs := http.FileServer(http.Dir("static"))
      http.Handle("/static/", http.StripPrefix("/static/", fs))
  
      // Gérer toutes les autres routes en servant index.html
      http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
          http.ServeFile(w, r, "templates/index.html")
      })
  
      log.Println("Server starting on http://localhost:8080")
      if err := http.ListenAndServe(":8080", nil); err != nil {
          log.Fatal(err)
      }
}