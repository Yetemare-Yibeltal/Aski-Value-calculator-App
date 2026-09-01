import { BinaryTranslator } from "../modules/binaryTranslator.js";

export class BinaryConverterViewComponent {
  constructor(containerElement) {
    this.container = containerElement;
  }

  render(currentText) {
    const binaryOutput = BinaryTranslator.textToBinary(currentText);

    this.container.innerHTML = `
      <div class="binary-converter-box">
        <h3 class="section-title">Raw Binary Representation</h3>
        <div class="binary-display">${binaryOutput || "00000000"}</div>
      </div>
    `;
  }
}
