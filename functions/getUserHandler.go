package functions

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
)

func GetUsersHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
   
    if r.Method == "OPTIONS" {
        w.WriteHeader(http.StatusOK)
        return
    }

    // Verify database connection
    if err := db.Ping(); err != nil {
        log.Printf("Database connection error: %v", err)
        http.Error(w, `{"error":"Database connection error"}`, http.StatusInternalServerError)
        return
    }

    // Query users
    rows, err := db.Query("SELECT ID, USERNAME FROM USER")
    if err != nil {
        log.Printf("SQL query error: %v", err)
        http.Error(w, `{"error":"Failed to fetch users"}`, http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var users []map[string]interface{}
    for rows.Next() {
        var id, username string
        if err := rows.Scan(&id, &username); err != nil {
            log.Printf("Row scan error: %v", err)
            continue
        }
        users = append(users, map[string]interface{}{
            "id":   id,
            "name": username,
        })
    }

    if err = rows.Err(); err != nil {
        log.Printf("Row iteration error: %v", err)
        http.Error(w, `{"error":"Error while reading users"}`, http.StatusInternalServerError)
        return
    }

    if len(users) == 0 {
        w.Write([]byte(`{"users":[]}`))
        return
    }

    if err := json.NewEncoder(w).Encode(users); err != nil {
        log.Printf("JSON encoding error: %v", err)
        http.Error(w, `{"error":"Error encoding response"}`, http.StatusInternalServerError)
        return
    }
}