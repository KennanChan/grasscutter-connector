import express, { Express, json } from "express"
import cors from "cors";

import { BaseEventSource } from "./EventManager"

type CommandServerEvent = "commands"

export class CommandServer extends BaseEventSource<CommandServerEvent> {
  private port: number
  private server?: Express

  constructor(port: number) {
    super("command_server_event")
    this.port = port
  }

  start() {
    this.server = express()
    this.server.use(json())
    this.server.use(cors());
    this.server.post("/commands", (req, res) => {
      if (req.body) {
        this.raise("commands", req.body)
      }
      res.status(200).json("ok")
    })
    this.server.listen(this.port, "0.0.0.0", () => {
      console.info(`!Grasscutter command server is running at: http://0.0.0.0:${this.port}`);
      console.info(`You can now execute grasscutter commands by posting a [\"command-text\"] json array to the server with application/json content-type`)
    })
  }
}