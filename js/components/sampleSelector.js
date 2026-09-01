import { SAMPLE_TEXTS } from "../../assets/sampleTexts.js";

export class SampleSelectorComponent {
  constructor(containerElement, onSelectCallback) {
    this.container = containerElement;
    this.onSelect = onSelectCallback;
  }

  render() {
    const buttonsHtml = SAMPLE_TEXTS.map(
      (sample, index) => `
      <button class="btn btn-secondary btn-sm" data-sample-idx="${index}">
        ${sample.label}
      </button>
    `,
    ).join("");

    this.container.innerHTML = `
      <div class="sample-selector-box">
        <span class="sample-label">Presets:</span>
        <div class="sample-buttons">${buttonsHtml}</div>
      </div>
    `;

    this.container.querySelectorAll("[data-sample-idx]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = e.target.getAttribute("data-sample-idx");
        this.onSelect(SAMPLE_TEXTS[idx].text);
      });
    });
  }
}
