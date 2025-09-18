export type EventListener = (data: any) => Promise<void> | void;

class EventBus {
  private listeners = new Map<string, EventListener[]>();

  async emit(eventName: string, data: any): Promise<void> {
    const listeners = this.listeners.get(eventName) || [];
    
    // Process all listeners for this event
    await Promise.all(
      listeners.map(listener => {
        try {
          return listener(data);
        } catch (error) {
          console.error(`Error in event listener for ${eventName}:`, error);
          return Promise.resolve();
        }
      })
    );
  }

  on(eventName: string, listener: EventListener): void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName)!.push(listener);
  }

  off(eventName: string, listener: EventListener): void {
    const listeners = this.listeners.get(eventName);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  removeAllListeners(eventName?: string): void {
    if (eventName) {
      this.listeners.delete(eventName);
    } else {
      this.listeners.clear();
    }
  }

  getListenerCount(eventName: string): number {
    return this.listeners.get(eventName)?.length || 0;
  }
}

export const eventBus = new EventBus();

