# Real-Time Chat

A Go-based web application that combines real-time chat functionality

## Features

- Real-time chat using WebSocket
- Private messaging system
- User authentication (login/register)
- Social posts and comments
- User notifications
- Session management
- Real-time typing indicators

## Project Structure

```
.
├── chat/              # WebSocket and real-time communication
├── database/          # Database configuration and connection
├── functions/         # Core business logic handlers
├── models/            # Data structures and types
├── routes/            # HTTP route definitions
├── services/         # Business logic services
├── static/           # Static assets
└── utils/            # Utility functions
```

## Prerequisites

- Go 1.x
- SQLite3

## Installation

1. Clone the repository
2. Install dependencies:

```sh
go mod download
```

## Running the Application

Start the server:

```sh
go run main.go
```

The server will start on `localhost:8080` by default.

## API Endpoints

- **Authentication**

  - POST `/register` - Create new user account
  - POST `/login` - User login
  - POST `/logout` - User logout

- **Social Features**

  - GET `/posts` - Get all posts
  - POST `/post` - Create new post
  - POST `/comment` - Add comment to post

- **Chat Features**
  - WebSocket `/ws` - WebSocket connection endpoint
  - POST `/private-message` - Send private message
  - GET `/users` - Get connected users

## Database

The application uses SQLite as its database, stored in `database/db.db`.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
