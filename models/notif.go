package models

type GetNotification struct {
	Id        int    `json:"id"`
	Sender    string `json:"sender"`
	Type      string `json:"type"`
	RelatedId int    `json:"related_id"`
	CreatedAt string `json:"created_at"`
	Status    string `json:"status"`
}

type Notification struct {
	Id        int    `json:"id"`
	ReceiverID string `json:"receiver_id"`
	SenderID   string `json:"sender_id"`
	Type       string `json:"type"`
	RelatedID  int    `json:"related_id"`
	Content    string `json:"content"`
	CreatedAt  string `json:"created_at"`
	Status     string `json:"status"`
}