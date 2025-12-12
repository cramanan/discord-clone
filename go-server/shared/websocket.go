package shared

import (
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader *websocket.Upgrader

func Upgrader() *websocket.Upgrader {
	if upgrader != nil {
		return upgrader
	}

	upgrader = &websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin:     func(r *http.Request) bool { return true },
	}
	return upgrader
}
