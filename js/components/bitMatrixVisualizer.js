export class BitMatrixVisualizerComponent {
  constructor(containerElement, onBitToggle) {
    this.container = containerElement;
    this.onBitToggle = onBitToggle;
  }

  render(text) {
    if (!this.container) return;
    if (!text) {
      this.container.innerHTML = `<p class="empty-msg">Enter text to inspect interactive bit states.</p>`;
      return;
    }

    const firstChar = text[0];
    const code = firstChar.codePointAt(0);
    const binaryStr = code.toString(2).padStart(8, "0");

    let html = `
      <div class="bit-matrix-card">
        <h3>8-Bit Signal Inspector (First Character: '<strong>${firstChar}</strong>')</h3>
        <p class="sub-text">Click any bit below to flip its state between 0 and 1:</p>
        <div class="bit-grid">
    `;

    for (let i = 0; i < 8; i++) {
      const bitVal = binaryStr[i];
      const bitWeight = Math.pow(2, 7 - i);
      html += `
        <div class="bit-box ${bitVal === "1" ? "active" : ""}" data-bit-index="${i}">
          <span class="bit-weight">2<sup>${7 - i}</sup> (${bitWeight})</span>
          <span class="bit-digit">${bitVal}</span>
          <button class="btn-flip" data-index="${i}">Flip</button>
        </div>
      `;
    }

    html += `
        </div>
        <div class="bit-summary">
          <span>Decimal: <strong>${code}</strong></span> | 
          <span>Hex: <strong>0x${code.toString(16).toUpperCase()}</strong></span>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
    this.bindEvents(binaryStr, text);
  }

  bindEvents(currentBinary, fullText) {
    this.container.querySelectorAll(".btn-flip").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.target.getAttribute("data-index"), 10);
        const bitArray = currentBinary.split("");
        bitArray[index] = bitArray[index] === "1" ? "0" : "1";

        const newCode = parseInt(bitArray.join(""), 2);
        const newChar = String.fromCharCode(newCode);
        const updatedText = newChar + fullText.slice(1);

        if (this.onBitToggle) this.onBitToggle(updatedText);
      });
    });
  }
}
