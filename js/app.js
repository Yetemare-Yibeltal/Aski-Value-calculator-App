import { CryptoEngine } from "./modules/cryptoEngine.js";

document.addEventListener("DOMContentLoaded", () => {
  const inputElement = document.getElementById("text-input");
  if (!inputElement) return;

  const worker = new Worker("js/workers/analyzerWorker.js");

  worker.onmessage = async (e) => {
    const { charDetails, encodings, frequency, executionTimeMs } = e.data;
    const hashes = await CryptoEngine.generateHashes(inputElement.value);

    renderPerformance(executionTimeMs);
    renderEncodings(encodings);
    renderHashes(hashes);
    renderFrequencyChart(frequency);
    renderTable(charDetails);
  };

  inputElement.addEventListener("input", (e) => {
    worker.postMessage({ text: e.target.value });
  });

  function renderPerformance(time) {
    const container = document.getElementById("performance-container");
    if (container)
      container.innerHTML = `<small>Execution Thread Time: <strong>${time} ms</strong></small>`;
  }

  function renderEncodings(enc) {
    const container = document.getElementById("binary-container");
    if (!container) return;
    container.innerHTML = `
      <div class="encoding-card">
        <div><strong>Base64:</strong> <code>${enc.base64}</code></div>
        <div><strong>URL Encoded:</strong> <code>${enc.urlEncoded}</code></div>
      </div>
    `;
  }

  function renderHashes(hashes) {
    const container = document.getElementById("hash-container");
    if (!container) return;
    container.innerHTML = `
      <div class="hash-grid">
        <div><strong>SHA-256:</strong> <code>${hashes.sha256}</code></div>
        <div><strong>SHA-512:</strong> <code>${hashes.sha512}</code></div>
      </div>
    `;
  }

  function renderFrequencyChart(freqArray) {
    const container = document.getElementById("frequency-container");
    if (!container) return;
    const maxCount = Math.max(...freqArray.map((f) => f.count), 1);

    container.innerHTML = `
      <h3>Character Frequency Distribution</h3>
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
});
