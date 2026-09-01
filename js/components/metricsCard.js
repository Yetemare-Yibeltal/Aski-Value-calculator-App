export class MetricsCardComponent {
  constructor(containerElement) {
    this.container = containerElement;
  }

  render(metrics) {
    this.container.innerHTML = `
      <div class="metrics-grid">
        <div class="metric-card">
          <span class="metric-label">Total Characters</span>
          <span class="metric-value">${metrics.totalChars}</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Total Words</span>
          <span class="metric-value">${metrics.totalWords}</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">ASCII Value Sum</span>
          <span class="metric-value">${metrics.sumAscii}</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Average ASCII</span>
          <span class="metric-value">${metrics.avgAscii}</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Peak Code Point</span>
          <span class="metric-value">${metrics.highestAscii}</span>
        </div>
      </div>
    `;
  }
}
