export class FrequencyChartComponent {
  constructor(containerElement) {
    this.container = containerElement;
  }

  render(frequencyData) {
    if (!frequencyData || frequencyData.length === 0) {
      this.container.innerHTML = "";
      return;
    }

    const itemsHtml = frequencyData
      .slice(0, 8)
      .map(
        (item) => `
      <div class="freq-item">
        <div class="freq-header">
          <span class="freq-char">${item.character}</span>
          <span class="freq-count">${item.count} (${item.percentage}%)</span>
        </div>
        <div class="freq-bar-bg">
          <div class="freq-bar-fill" style="width: ${item.percentage}%;"></div>
        </div>
      </div>
    `,
      )
      .join("");

    this.container.innerHTML = `
      <div class="freq-container">
        <h3 class="section-title">Character Frequency Breakdown</h3>
        <div class="freq-list">
          ${itemsHtml}
        </div>
      </div>
    `;
  }
}
