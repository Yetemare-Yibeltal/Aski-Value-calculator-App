export class PerformanceTracker {
  static measure(fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    return {
      result,
      executionTimeMs: (end - start).toFixed(3),
    };
  }
}
