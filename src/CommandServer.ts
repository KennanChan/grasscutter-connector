import express, { Express } from "express"
import { Server } from "http"
import cors from "cors";

import { BaseEventSource } from "./EventManager"

type CommandServerEvent = "commands"

interface CommandServerOptions {
  web: boolean
}
export class CommandServer extends BaseEventSource<CommandServerEvent> {
  private port: number
  private server?: Server
  private options: Partial<CommandServerOptions>

  constructor(port: number, options: Partial<CommandServerOptions>) {
    super("command_server_event")
    this.port = port
    this.options = options
  }

  async start(): Promise<CommandServer> {
    await this.stop()
    const app = express()
    app.use(cors());
    app.use(express.json())
    if (this.options.web) {
      app.use(express.static("public"));
    }
    app.post("/commands", (req, res) => {
      if (req.body) {
        this.raise("commands", req.body)
      }
      res.status(200).json("ok")
    })
    this.server = app.listen(this.port, "0.0.0.0", () => {
      console.info(`!Grasscutter command server is running at: http://0.0.0.0:${this.port}`);
      console.info(`You can now execute grasscutter commands by posting a [\"command-text\"] json array to the server with application/json content-type`)
    })
    return this
  }

  stop(): Promise<CommandServer> {
    return new Promise<CommandServer>((resolve) => {
      if (this.server) {
        this.server.on("close", () => {
          this.server = undefined
          resolve(this)
        })
        this.server.close()
      } else {
        resolve(this)
      }
    })
  }

  use(middleware: { apply: (server: Server) => void }) {
    if (this.server) {
      middleware.apply(this.server)
    }
  }
}