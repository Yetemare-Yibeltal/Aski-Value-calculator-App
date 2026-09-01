import { BitwiseCalculator } from '../modules/bitwiseCalculator.js';

export class BitwiseViewComponent {
  constructor(containerElement) {
    this.container = containerElement;
  }

  render(text) {
    const data = BitwiseCalculator.performOperations(text);
    if (!data) {
      this.container.innerHTML = '';
      return;
    }

    this.container.innerHTML = `
      <div class="bitwise-box">
        <h3 class="section-title">Bitwise Operations (First Char: '${text[0]}')</h3>
        <div class="bitwise-grid">
          <div class="bitwise-item"><span>Shift Left (<< 1):</span> <strong>${data.shiftLeft}</strong></div>
          <div class="bitwise-item"><span>Shift Right (>> 1):</span> <strong>${data.shiftRight}</strong></div>
          <div class="bitwise-item"><span>Bitwise NOT (~):</span> <strong>${data.notOperation}</strong></div>
          <div class="bitwise-item"><span>AND Mask (& 0x0F):</span> <strong>${data.andMask}</strong></div>
          <div class="bitwise-item"><span>OR Mask (| 0xF0):</span> <strong>${data.orMask}</strong></div>
          <div class="bitwise-item"><span>XOR Mask (^ 0xFF):</span> <strong>${data.xorMask}</strong></div>
        </div>
      </div>
    `;
  }
}