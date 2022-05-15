import { Server } from "http"
import WebSocket from "ws"
import { BaseEventSource } from "./EventManager"

type TerminalServerEvent = "input"

export class TerminalServer extends BaseEventSource<TerminalServerEvent> {
  private websocketServer?: WebSocket.Server

  constructor() {
    super("terminal_server_event")
  }

  apply(server: Server) {
    this.websocketServer = new WebSocket.Server({
      noServer: true,
      path: "/terminal"
    })
    server.on("upgrade", (req, socket, head) => {
      this.websocketServer?.handleUpgrade(req, socket, head, (websocket) => {
        this.websocketServer?.emit("connection", websocket, req)
      })
    })
  }

  send(output: any) {
    if (this.websocketServer) {
      this.websocketServer.clients.forEach(client => {
        client.send(output, function (error) {
          if (error) {
            console.error(error)
          }
        })
      })
    }
  }
}