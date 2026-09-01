import { HashCalculator } from "../modules/hashCalculator.js";

export class HashViewComponent {
  constructor(containerElement) {
    this.container = containerElement;
  }

  render(text) {
    if (!text) {
      this.container.innerHTML = "";
      return;
    }

    const checksum = HashCalculator.simpleChecksum(text);

    this.container.innerHTML = `
      <div class="hash-box">
        <span class="hash-label">32-Bit String Checksum:</span>
        <code class="hash-value">0x${checksum.toString(16).toUpperCase().padStart(8, "0")}</code>
      </div>
    `;
  }
}
