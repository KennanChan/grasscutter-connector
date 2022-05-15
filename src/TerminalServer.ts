import { Server } from "http"
import WebSocket from "ws"
import { BaseEventSource } from "./EventManager"

type TerminalServerEvent = "commands"

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
    this.websocketServer.on("connection", (connection, request) => {
      connection.on("message", (data) => {
        try {
          const commands = JSON.parse(data.toString("utf-8"))
          this.raise("commands", commands)
        } catch (error) {
          console.error(error)
        }
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