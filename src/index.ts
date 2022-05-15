import minimist from "minimist"

import { CommandServer } from "./CommandServer"
import { GrasscutterRunner } from "./GrasscutterRunner"
import { TerminalServer } from "./TerminalServer"

const DEFAULT_JAR_FILE = "./grasscutter.jar"
const DEFAULT_PORT = 9508

async function main() {
  const args = minimist(process.argv.slice(2))
  const port = Number(args.port)
  const jarFilePath = args.jar ?? DEFAULT_JAR_FILE
  const commandServer = new CommandServer(Number.isNaN(port) ? DEFAULT_PORT : port, { web: args.web !== 0 })
  const terminalServer = new TerminalServer()
  const grasscutterRunner = new GrasscutterRunner(jarFilePath)
  commandServer.on("commands", (commands) => {
    grasscutterRunner.send(commands)
  })
  await grasscutterRunner.run()
  await commandServer.start()
  commandServer.use(terminalServer)
  grasscutterRunner.on("output", (output) => {
    terminalServer.send(output)
  })
}

main()
