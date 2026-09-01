export class PerformanceBannerComponent {
  constructor(containerElement) {
    this.container = containerElement;
  }

  render(executionTime) {
    if (executionTime === undefined) {
      this.container.innerHTML = "";
      return;
    }

    this.container.innerHTML = `
      <div class="perf-banner">
        <span>⚡ Processed in <strong>${executionTime} ms</strong></span>
      </div>
    `;
  }
}
