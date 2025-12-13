package event

type EventType string

const (
	MESSAGE EventType = "MESSAGE"
)

type Event[P any] struct {
	Type    EventType `json:"type"`
	Payload P         `json:"payload"`
}
