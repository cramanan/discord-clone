package types

import (
	"sync"

	"github.com/gorilla/websocket"
)

type MutexConn Mutex[*websocket.Conn]

func NewMutexConn(conn *websocket.Conn) MutexConn { return MutexConn{sync.Mutex{}, conn} }

func (mutex *MutexConn) WriteJSON(v interface{}) error {
	mutex.Lock()
	defer mutex.Unlock()
	return mutex.data.WriteJSON(v)
}

func (mutex *MutexConn) ReadMessage() (messageType int, p []byte, err error) {
	mutex.Lock()
	defer mutex.Unlock()
	return mutex.data.ReadMessage()
}
