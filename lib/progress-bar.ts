type ProgressState = {
  value: number;
  visible: boolean;
};

type Listener = (state: ProgressState) => void;

class ProgressBarController {
  private state: ProgressState = { value: 0, visible: false };
  private listeners = new Set<Listener>();
  private trickleTimer: ReturnType<typeof setInterval> | null = null;
  private pending = 0;

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private emit() {
    this.listeners.forEach((l) => l(this.state));
  }

  private set(patch: Partial<ProgressState>) {
    this.state = { ...this.state, ...patch };
    this.emit();
  }

  start() {
    this.pending += 1;
    if (this.pending > 1) return;

    this.set({ visible: true, value: 8 });
    this.trickleTimer = setInterval(() => {
      const next = Math.min(this.state.value + Math.random() * 8, 90);
      this.set({ value: next });
    }, 400);
  }

  done() {
    this.pending = Math.max(0, this.pending - 1);
    if (this.pending > 0) return;

    if (this.trickleTimer) {
      clearInterval(this.trickleTimer);
      this.trickleTimer = null;
    }
    this.set({ value: 100 });
    setTimeout(() => this.set({ visible: false, value: 0 }), 300);
  }
}

export const progressBar = new ProgressBarController();
