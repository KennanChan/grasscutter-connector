import uniqueId from "lodash/uniqueId"

type EventHandler = (...args: any[]) => void
type TerminatingEventHandler = (...args: any[]) => boolean
type Unsubscribe = () => void

interface EventData {
  id: string,
  handler: EventHandler
}

export interface EventEmitter {
  raise(eventName: string, ...args: any[]): void
}

export interface EventSource {
  on(eventName: string, handler: EventHandler): Unsubscribe
  once(eventName: string, handler: TerminatingEventHandler): void
}

export abstract class BaseEventSource<T extends string> implements EventSource {
  protected eventManager: EventManager

  constructor(eventSourceName: string) {
    this.eventManager = new EventManager(eventSourceName)
  }

  on(eventName: T, handler: (...args: any[]) => void): () => void {
    return this.eventManager.on(eventName, handler)
  }

  once(eventName: T, handler: (...args: any[]) => boolean): void {
    this.eventManager.once(eventName, handler)
  }

  protected raise(eventName: T, ...args: any[]): void {
    this.eventManager.raise(eventName, ...args)
  }
}

export class EventManager implements EventSource, EventEmitter {
  public readonly name: string
  private events: Map<string, EventData[]> = new Map<string, EventData[]>()
  constructor(name: string = "event_manager_") {
    this.name = name
  }

  on(eventName: string, handler: EventHandler): Unsubscribe {
    const id = uniqueId(this.name)
    const listeners = this.events.get(eventName) ?? []
    listeners.push({ id, handler })
    this.events.set(eventName, listeners)
    return () => {
      const listeners = this.events.get(eventName)
      if (listeners) {
        const index = listeners.findIndex(l => l.id === id)
        listeners.splice(index, 1)
      }
    }
  }

  once(eventName: string, handler: TerminatingEventHandler): void {
    const unsubscribe = this.on(eventName, async (...args) => {
      const terminate = handler(...args)
      if (terminate) {
        unsubscribe()
      }
    })
  }

  raise(eventName: string, ...args: any[]): void {
    const events = this.events.get(eventName)
    if (events) {
      events.forEach(({ handler }) => {
        try {
          handler(...args)
        } catch (error) {
          console.error(error)
        }
      })
    }
  }
}
