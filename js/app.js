import { CryptoEngine } from "./modules/cryptoEngine.js";
import { SteganographyDetector } from "./modules/steganographyDetector.js";
import { TextTransformer } from "./modules/textTransformer.js";
import { BitMatrixVisualizerComponent } from "./components/bitMatrixVisualizer.js";

document.addEventListener("DOMContentLoaded", () => {
  const inputElement = document.getElementById("text-input");
  if (!inputElement) return;

  // Initialize Web Worker thread for heavy calculations
  const worker = new Worker("js/workers/analyzerWorker.js");

  // Initialize interactive 8-bit visualizer with live input sync
  const matrixComp = new BitMatrixVisualizerComponent(
    document.getElementById("matrix-container"),
    (updatedText) => {
      inputElement.value = updatedText;
      triggerAnalysis(updatedText);
    },
  );

  // Send input to worker on change
  inputElement.addEventListener("input", (e) => {
    triggerAnalysis(e.target.value);
  });

  function triggerAnalysis(text) {
    worker.postMessage({ text });
  }

  // Handle messages returned from the Web Worker thread
  worker.onmessage = async (e) => {
    const { charDetails, encodings, frequency, executionTimeMs } = e.data;
    const textVal = inputElement.value;

    // Execute concurrent asynchronous tasks
    const [hashes, stegoResult] = await Promise.all([
      CryptoEngine.generateHashes(textVal),
      Promise.resolve(SteganographyDetector.analyze(textVal)),
    ]);

    const morseCode = TextTransformer.toMorseCode(textVal);
    const rot13Cipher = TextTransformer.toRot13(textVal);

    // Render all layout components
    renderPerformance(executionTimeMs);
    renderMetrics(textVal.length, stegoResult);
    renderEncodings(encodings, hashes, morseCode, rot13Cipher);
    renderHashes(hashes);
    renderFrequencyChart(frequency);
    renderTable(charDetails);
    matrixComp.render(textVal);
  };

  function renderPerformance(time) {
    const container = document.getElementById("performance-container");
    if (container) {
      container.innerHTML = `<small>Worker Thread Execution: <strong>${time} ms</strong></small>`;
    }
  }

  function renderMetrics(charCount, stego) {
    const container = document.getElementById("metrics-container");
    if (!container) return;
    container.innerHTML = `
      <div class="metrics-grid">
        <div class="metric-card">
          <span>Character Count:</span>
          <strong>${charCount}</strong>
        </div>
        <div class="metric-card ${stego.hasHiddenChars ? "warning" : ""}">
          <span>Steganography Scan:</span>
          <strong>${stego.hasHiddenChars ? `${stego.hiddenList.length} Hidden Payload(s) Found` : "Clean Stream"}</strong>
        </div>
      </div>
    `;
  }

  function renderEncodings(enc, hashes, morse, rot13) {
    const container = document.getElementById("binary-container");
    if (!container) return;
    container.innerHTML = `
      <div class="encoding-card">
        <div><strong>Base64 Stream:</strong> <code>${enc.base64 || "-"}</code></div>
        <div><strong>URL Escaped:</strong> <code>${enc.urlEncoded || "-"}</code></div>
        <div><strong>Morse Code:</strong> <code>${morse || "-"}</code></div>
        <div><strong>ROT13 Cipher:</strong> <code>${rot13 || "-"}</code></div>
      </div>
    `;
  }

  function renderHashes(hashes) {
    const container = document.getElementById("hash-container");
    if (!container) return;
    container.innerHTML = `
      <div class="hash-grid">
        <div><strong>SHA-1:</strong> <code>${hashes.sha1}</code></div>
        <div><strong>SHA-256:</strong> <code>${hashes.sha256}</code></div>
        <div><strong>SHA-512:</strong> <code>${hashes.sha512}</code></div>
      </div>
    `;
  }

  function renderFrequencyChart(freqArray) {
    const container = document.getElementById("frequency-container");
    if (!container) return;
    if (!freqArray || freqArray.length === 0) {
      container.innerHTML = `<p class="empty-msg">No frequency data available.</p>`;
      return;
    }

    const maxCount = Math.max(...freqArray.map((f) => f.count), 1);

    container.innerHTML = `
      <h3>Character Frequency Breakdown</h3>
      <div class="chart-bars">
        ${freqArray
          .slice(0, 10)
          .map(
            (f) => `
          <div class="bar-row">
            <span class="bar-label">${f.char}</span>
            <div class="bar-fill-wrap">
              <div class="bar-fill" style="width: ${(f.count / maxCount) * 100}%"></div>
            </div>
            <span class="bar-val">${f.count} (${f.percentage}%)</span>
          </div>
        `,
          )
          .join("")}
      </div>
    `;
  }

  function renderTable(data) {
    const container = document.getElementById("table-container");
    if (!container) return;
    if (!data || data.length === 0) {
      container.innerHTML = `<p class="empty-msg">No characters to inspect.</p>`;
      return;
    }

    container.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Index</th>
            <th>Char</th>
            <th>Decimal</th>
            <th>Hex</th>
            <th>Binary</th>
            <th>Unicode</th>
            <th>UTF-8 Bytes</th>
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (d) => `
            <tr>
              <td>${d.index}</td>
              <td><strong>${d.character}</strong></td>
              <td>${d.decimal}</td>
              <td><code>${d.hex}</code></td>
              <td><code>${d.binary}</code></td>
              <td><code>${d.unicode}</code></td>
              <td><code>${d.utf8Bytes}</code></td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    `;
  }

  // Trigger initial execution if textarea has preset text
  if (inputElement.value) {
    triggerAnalysis(inputElement.value);
  }
});
