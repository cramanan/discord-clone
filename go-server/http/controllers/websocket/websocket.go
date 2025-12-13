package websocket

import (
	"encoding/json"
	"go-server/http/middlewares"
	"go-server/http/models"
	"go-server/shared"
	"go-server/types"
	"go-server/types/event"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

func WebSocket(c *gin.Context) {
	sender, err := middlewares.GetAuthedUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	conn, err := shared.Upgrader().Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	mutexConn := types.NewMutexConn(conn)

	// Read pump
	go func(conn *websocket.Conn) {
		defer conn.Close()
		for {
			_, payload, err := mutexConn.ReadMessage()
			if err != nil {
				log.Println(err.Error())
				break
			}

			log.Println("received:", string(payload))
			var baseEvent event.Event[any]
			if err = json.Unmarshal(payload, &baseEvent); err != nil {
				log.Println(err.Error())
				continue
			}

			switch baseEvent.Type {
			case event.MESSAGE:
				var messageEvent event.Event[models.Chats]
				if err = json.Unmarshal(payload, &messageEvent); err != nil {
					log.Println(err.Error())
					continue
				}

				messageEvent.Payload.SenderUUID = sender.UUID

				if err = mutexConn.WriteJSON(messageEvent); err != nil {
					log.Println(err.Error())
				}
			}
		}
	}(conn)

}
