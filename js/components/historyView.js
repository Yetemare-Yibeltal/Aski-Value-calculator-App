export class HistoryViewComponent {
  constructor(containerElement, onSelectCallback) {
    this.container = containerElement;
    this.onSelect = onSelectCallback;
  }

  render(historyItems) {
    if (!historyItems || historyItems.length === 0) {
      this.container.innerHTML = "";
      return;
    }

    const itemsHtml = historyItems
      .map(
        (text, index) => `
      <button class="history-item-btn" data-index="${index}">
        ${text.length > 25 ? text.substring(0, 25) + "..." : text}
      </button>
    `,
      )
      .join("");

    this.container.innerHTML = `
      <div class="history-panel">
        <span class="history-title">Recent Inputs:</span>
        <div class="history-chips">${itemsHtml}</div>
      </div>
    `;

    this.container.querySelectorAll(".history-item-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = e.target.getAttribute("data-index");
        this.onSelect(historyItems[idx]);
      });
    });
  }
}
