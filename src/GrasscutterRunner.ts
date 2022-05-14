import { ChildProcess, spawn } from "child_process";
import { BaseEventSource } from "./EventManager"

type GrasscutterRunnerEvent = "error" | "output"

export class GrasscutterRunner extends BaseEventSource<GrasscutterRunnerEvent> {
  private jarFilePath: string
  private grasscutter?: ChildProcess

  constructor(jarFilePath: string) {
    super("grasscutter_runner_event")
    this.jarFilePath = jarFilePath
  }

  kill(): Promise<GrasscutterRunner> {
    return new Promise<GrasscutterRunner>((resolve, reject) => {
      if (this.grasscutter) {
        this.grasscutter.once("close", () => {
          this.grasscutter = undefined
          resolve(this)
        })
        this.grasscutter.kill()
      } else {
        resolve(this)
      }
    })
  }

  async run(): Promise<GrasscutterRunner> {
    await this.kill()
    const cleanExit = async () => {
      await this.kill()
      process.exit()
    }
    process.on('SIGINT', cleanExit)
    process.on('SIGTERM', cleanExit)
    this.grasscutter = spawn(`java`, ['-jar', this.jarFilePath], {
      cwd: process.cwd(),
      detached: true
    })
    this.grasscutter.stdout?.pipe(process.stdout)
    this.grasscutter.once("exit", () => {
      this.grasscutter = undefined
    })
    if (this.grasscutter?.stdin) {
      process.stdin.pipe(this.grasscutter?.stdin)
    }
    return this
  }

  send(commands: string[]) {
    commands.forEach(command => {
      this.grasscutter?.stdin?.write(`${command.replace('\n', '')}\n`)
    })
  }
}