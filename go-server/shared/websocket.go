package shared

import (
	"go-server/types"
	"net/http"

	"github.com/google/uuid"
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

type hub types.Mutex[map[uuid.UUID]*types.MutexConn]

func (hub *hub) Set(key uuid.UUID, value *types.MutexConn) *types.MutexConn {
	hub.Lock()
	defer hub.Unlock()
	hub.Data[key] = value
	return hub.Data[key]
}

func (hub *hub) Get(key uuid.UUID) *types.MutexConn {
	hub.Lock()
	defer hub.Unlock()
	return hub.Data[key]
}

var _hub *hub

func Hub() *hub {
	if _hub != nil {
		return _hub
	}
	_hub = &hub{Data: make(map[uuid.UUID]*types.MutexConn)}
	return _hub
}
