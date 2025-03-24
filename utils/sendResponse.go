package utils

import (
	"encoding/json"
	"net/http"
)

// SendResponse sends a JSON response with the given status code and data
func SendResponse(w http.ResponseWriter, status int, data interface{}) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    json.NewEncoder(w).Encode(data)
}