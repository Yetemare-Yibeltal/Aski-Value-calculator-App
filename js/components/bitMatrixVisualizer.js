export class BitMatrixVisualizerComponent {
  constructor(containerElement) {
    this.container = containerElement;
  }

  render(text) {
    if (!text || text.length === 0) {
      this.container.innerHTML = "";
      return;
    }

    const sample = text.slice(0, 16);
    const gridCells = Array.from(sample)
      .map((char) => {
        const bin = char.charCodeAt(0).toString(2).padStart(8, "0");
        const bitsHtml = Array.from(bin)
          .map(
            (b) =>
              `<span class="bit-dot ${b === "1" ? "bit-active" : ""}">${b}</span>`,
          )
          .join("");

        return `
        <div class="matrix-card">
          <div class="matrix-char">${char === " " ? "␣" : char}</div>
          <div class="matrix-bits">${bitsHtml}</div>
        </div>
      `;
      })
      .join("");

    this.container.innerHTML = `
      <div class="matrix-box">
        <h3 class="section-title">8-Bit Matrix Visualizer (First 16 Chars)</h3>
        <div class="matrix-grid">${gridCells}</div>
      </div>
    `;
  }
}
