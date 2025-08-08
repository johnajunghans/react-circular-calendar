import '@testing-library/jest-dom'

// Provide a basic ResizeObserver mock for jsdom
if (typeof (globalThis as any).ResizeObserver === 'undefined') {
  class ResizeObserverMock {
    callback: ResizeObserverCallback
    constructor(callback: ResizeObserverCallback) {
      this.callback = callback
    }
    observe() {/* noop */}
    unobserve() {/* noop */}
    disconnect() {/* noop */}
  }
  ;(globalThis as any).ResizeObserver = ResizeObserverMock as any
}


