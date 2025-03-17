package database

import (
	"database/sql"
	"os"
	"path/filepath"

	_ "github.com/mattn/go-sqlite3"
)

type Database struct {
    *sql.DB
}


func InitDB() (*Database, error) {
    // Créer le dossier database s'il n'existe pas
    dbPath := "./database"
    if err := os.MkdirAll(dbPath, 0755); err != nil {
        return nil, err
    }

    // Chemin complet de la base de données
    dbFile := filepath.Join(dbPath, "db.db")
    
    // Ouvrir/créer la base de données
    db, err := sql.Open("sqlite3", dbFile)
    if err != nil {
        return nil, err
    }

    // Tester la connexion
    if err = db.Ping(); err != nil {
        return nil, err
    }

    // Création des tables
    createTables := `
    CREATE TABLE IF NOT EXISTS COMMENT (
        ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        USERID TEXT NOT NULL,
        POST_ID INTEGER NOT NULL,
        CONTENT TEXT NOT NULL,
        LIKE_COMMENT INTEGER NOT NULL DEFAULT 0,
        DISLIKE_COMMENT INTEGER NOT NULL DEFAULT 0,
        CREATED_AT TEXT DEFAULT (datetime('now', 'localtime')),
        FOREIGN KEY (USERID) REFERENCES USER (ID),
        FOREIGN KEY (POST_ID) REFERENCES POST (ID) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS CONVERSATION (
        ID TEXT NOT NULL PRIMARY KEY,
        USER1ID TEXT NOT NULL REFERENCES USER,
        USER2ID TEXT NOT NULL REFERENCES USER,
        STARTED_AT TEXT DEFAULT (datetime('now', 'localtime'))
    );
    CREATE TABLE IF NOT EXISTS DISLIKE (
        ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        USER_ID TEXT NOT NULL,
        POST_ID INTEGER NOT NULL,
        CREATED_AT TEXT DEFAULT (datetime('now', 'localtime')),
        FOREIGN KEY (USER_ID) REFERENCES USER (ID),
        FOREIGN KEY (POST_ID) REFERENCES POST (ID) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS LIKES (
        ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        USER_ID TEXT NOT NULL,
        POST_ID INTEGER NOT NULL,
        CREATED_AT TEXT DEFAULT (datetime('now', 'localtime')),
        FOREIGN KEY (USER_ID) REFERENCES USER (ID),
        FOREIGN KEY (POST_ID) REFERENCES POST (ID) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS MESSAGE (
        ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        CONVERSATION_ID INTEGER NOT NULL,
        SENDER_ID TEXT NOT NULL,
        CONTENT TEXT NOT NULL,
        READ_STATUS INTEGER NOT NULL DEFAULT 0,
        SENT_AT TEXT DEFAULT (datetime('now', 'localtime')),
        IMAGE TEXT,
        FOREIGN KEY (CONVERSATION_ID) REFERENCES CONVERSATION (ID),
        FOREIGN KEY (SENDER_ID) REFERENCES USER (ID)
    );

  
    CREATE TABLE IF NOT EXISTS NOTIFICATION (
        ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        RECEIVER_ID TEXT NOT NULL REFERENCES USER,
        SENDER_ID TEXT REFERENCES USER,
        TYPE TEXT NOT NULL,
        RELATED_ID INTEGER,
        CONTENT TEXT,
        STATUS TEXT DEFAULT 'unread' NOT NULL,
        CREATED_AT TEXT DEFAULT (datetime('now', 'localtime')),
        CHECK (STATUS IN ('unread', 'read')),
        CHECK (TYPE IN ('like', 'dislike', 'like_comment', 'dislike_comment', 'comment', 'post', 'message', 'friend_request', 'system'))
    );

    CREATE TABLE IF NOT EXISTS POST (
        ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        USER_ID TEXT NOT NULL REFERENCES USER ON DELETE CASCADE,
        CONTENT TEXT NOT NULL,
        LIKE INTEGER DEFAULT 0 NOT NULL,
        DISLIKE INTEGER DEFAULT 0 NOT NULL,
        COMMENT INTEGER DEFAULT 0 NOT NULL,
        CATEGORY TEXT NOT NULL,
        IMAGE TEXT,
        CREATED_AT TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS SESSION (
        ID TEXT NOT NULL PRIMARY KEY,
        USERID TEXT NOT NULL,
        CREATED_AT TEXT DEFAULT (datetime('now', 'localtime')),
        LAST_ACTIVE_AT TEXT DEFAULT (datetime('now', 'localtime')),
        EXPIRES_AT TEXT NOT NULL,
        FOREIGN KEY (USERID) REFERENCES USER (ID)
    );
  CREATE TABLE IF NOT EXISTS USER (
        ID TEXT NOT NULL PRIMARY KEY,
        EMAIL TEXT NOT NULL UNIQUE,
        PASSWORD TEXT NOT NULL,
        USERNAME TEXT NOT NULL UNIQUE,
        FIRSTNAME TEXT NOT NULL,
        LASTNAME TEXT NOT NULL,
        AGE TEXT NOT NULL,
        GENRE TEXT NOT NULL,
        IMAGE TEXT,
        CREATED_AT TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS USER_STATUS (
        USERID TEXT NOT NULL PRIMARY KEY,
        STATUS TEXT NOT NULL CHECK (STATUS IN ('online', 'offline')),
        LAST_ACTIVE_AT TEXT DEFAULT (datetime('now', 'localtime')),
        FOREIGN KEY (USERID) REFERENCES USER (ID)
    );`
    _, err = db.Exec(createTables)
    if err != nil {
        return nil, err
    }

    return &Database{db}, nil
}