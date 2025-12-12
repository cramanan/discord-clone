package websocket

import (
	"go-server/http/middlewares"
	"go-server/shared"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

func WebSocket(c *gin.Context) {
	_, err := middlewares.GetAuthedUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	conn, err := shared.Upgrader().Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	sink := make(chan []byte, 256)

	// Read pump
	go func(conn *websocket.Conn) {
		defer conn.Close()
		for {
			_, payload, err := conn.ReadMessage()
			if err != nil {
				log.Println(err.Error())
				return
			}

			log.Println("received", string(payload))

			sink <- []byte("\"Pong\"")
		}
	}(conn)

	go func(conn *websocket.Conn) {
		defer conn.Close()
		for data := range sink {
			log.Println("sending:", string(data))
			if err := conn.WriteMessage(websocket.BinaryMessage, data); err != nil {
				log.Println(err.Error())
				return
			}
		}
	}(conn)
}
