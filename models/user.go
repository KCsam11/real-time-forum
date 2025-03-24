package models

import "time"

type User struct {
    ID        string       `json:"ID"`
    Email     string    `json:"EMAIL"`
    Username  string    `json:"USERNAME"`
    CreatedAt time.Time `json:"CREATED_AT"`
}