FROM golang:1.23-alpine

WORKDIR /app

# Install required packages for CGO and SQLite
RUN apk add --no-cache gcc musl-dev sqlite-dev

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . .

# Enable CGO and build the application
ENV CGO_ENABLED=1
RUN go build -o /app/main .

EXPOSE 3123
CMD ["/app/main"]