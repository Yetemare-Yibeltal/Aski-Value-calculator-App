import { ConversionEngine } from "./modules/conversionEngine.js";
import { CryptoEngine } from "./modules/cryptoEngine.js";
import { SteganographyDetector } from "./modules/steganographyDetector.js";
import { TextTransformer } from "./modules/textTransformer.js";
import { BitMatrixVisualizerComponent } from "./components/bitMatrixVisualizer.js";

document.addEventListener("DOMContentLoaded", () => {
  const inputElement = document.getElementById("text-input");
  if (!inputElement) return;

  const matrixComp = new BitMatrixVisualizerComponent(
    document.getElementById("matrix-container"),
    (updatedText) => {
      inputElement.value = updatedText;
      processAll(updatedText);
    },
  );

  async function processAll(text) {
    // 1. Core Conversion & Entropy
    const { charData, entropy, nonPrintableCount } =
      ConversionEngine.analyzeString(text);

    // 2. Steganography Scan
    const stegoResult = SteganographyDetector.analyze(text);

    // 3. Cryptographic Hashes
    const hashes = await CryptoEngine.generateHashes(text);

    // 4. Transform Formats
    const morse = TextTransformer.toMorseCode(text);
    const rot13 = TextTransformer.toRot13(text);

    // 5. Render UI Sections
    renderMetrics(text.length, entropy, nonPrintableCount, stegoResult);
    renderEncodings(hashes, morse, rot13);
    matrixComp.render(text);
    renderTable(charData);
  }

  function renderMetrics(len, entropy, nonPrintable, stego) {
    const container = document.getElementById("metrics-container");
    if (!container) return;
    container.innerHTML = `
      <div class="metric-card"><span>Length:</span> <strong>${len} chars</strong></div>
      <div class="metric-card"><span>Shannon Entropy:</span> <strong>${entropy} bits/symbol</strong></div>
      <div class="metric-card"><span>Control Codes:</span> <strong>${nonPrintable}</strong></div>
      <div class="metric-card ${stego.hasHiddenChars ? "warning" : ""}">
        <span>Steganography Warning:</span> 
        <strong>${stego.hasHiddenChars ? "Hidden Characters Detected!" : "Clean Stream"}</strong>
      </div>
    `;
  }

  function renderEncodings(hashes, morse, rot13) {
    const container = document.getElementById("binary-container");
    if (!container) return;
    container.innerHTML = `
      <div class="encoding-field"><strong>SHA-256 Checksum:</strong> <code>${hashes.sha256}</code></div>
      <div class="encoding-field"><strong>Morse Code Stream:</strong> <code>${morse}</code></div>
      <div class="encoding-field"><strong>ROT13 Cipher:</strong> <code>${rot13}</code></div>
    `;
  }

  function renderTable(data) {
    const container = document.getElementById("table-container");
    if (!container) return;
    container.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Char</th>
            <th>Category</th>
            <th>Decimal</th>
            <th>Hex</th>
            <th>Binary</th>
            <th>Unicode</th>
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (d) => `
            <tr>
              <td>${d.index}</td>
              <td><strong>${d.character}</strong></td>
              <td>${d.category}</td>
              <td>${d.decimal}</td>
              <td><code>${d.hexadecimal}</code></td>
              <td><code>${d.binary}</code></td>
              <td><code>${d.unicodePoint}</code></td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    `;
  }

  inputElement.addEventListener("input", (e) => processAll(e.target.value));
  processAll(inputElement.value);
});
