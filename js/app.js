import { CryptoEngine } from "./modules/cryptoEngine.js";
import { SteganographyDetector } from "./modules/steganographyDetector.js";
import { TextTransformer } from "./modules/textTransformer.js";
import { HistoryManager } from "./modules/historyManager.js";
import { BitMatrixVisualizerComponent } from "./components/bitMatrixVisualizer.js";

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const inputElement = document.getElementById("text-input");
  const btnClearInput = document.getElementById("btn-clear-input");
  const btnResetHistory = document.getElementById("btn-reset-history");
  const btnExportHistory = document.getElementById("btn-export-history");
  const btnCopyMetrics = document.getElementById("btn-copy-metrics");
  const btnRecalcMetrics = document.getElementById("btn-recalc-metrics");

  if (!inputElement) return;

  const historyMgr = new HistoryManager();
  const worker = new Worker("js/workers/analyzerWorker.js");

  const matrixComp = new BitMatrixVisualizerComponent(
    document.getElementById("matrix-container"),
    (updatedText) => {
      inputElement.value = updatedText;
      triggerAnalysis(updatedText);
    },
  );

  // --- Input Controls ---

  if (btnClearInput) {
    btnClearInput.addEventListener("click", () => {
      inputElement.value = "";
      triggerAnalysis("");
      inputElement.focus();
    });
  }

  inputElement.addEventListener("input", (e) => {
    triggerAnalysis(e.target.value);
  });

  // --- History Action Listeners ---

  if (btnResetHistory) {
    btnResetHistory.addEventListener("click", () => {
      if (
        confirm("Are you sure you want to clear your entire analysis history?")
      ) {
        historyMgr.clear();
        renderHistory();
      }
    });
  }

  btnExportHistory?.addEventListener("click", () => {
    const data = JSON.stringify(historyMgr.get(), null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `history-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // --- Metrics Action Listeners ---

  btnCopyMetrics?.addEventListener("click", () => {
    const charLen = document.getElementById("val-char-len")?.innerText || "0";
    const entropy = document.getElementById("val-entropy")?.innerText || "0";
    const stego = document.getElementById("val-stego")?.innerText || "Clean";

    const summary = `--- Text Diagnostics Metrics ---\nLength: ${charLen}\nEntropy: ${entropy}\nSteganography: ${stego}`;
    navigator.clipboard.writeText(summary);
    alert("Metrics copied to clipboard!");
  });

  btnRecalcMetrics?.addEventListener("click", () => {
    triggerAnalysis(inputElement.value);
  });

  // --- Worker & Analysis Loop ---

  function triggerAnalysis(text) {
    worker.postMessage({ text });
    if (text.trim()) {
      historyMgr.save(text);
      renderHistory();
    }
  }

  worker.onmessage = async (e) => {
    const { charDetails, encodings, frequency, executionTimeMs } = e.data;
    const textVal = inputElement.value;

    const [hashes, stegoResult] = await Promise.all([
      CryptoEngine.generateHashes(textVal),
      Promise.resolve(SteganographyDetector.analyze(textVal)),
    ]);

    const morseCode = TextTransformer.toMorseCode(textVal);
    const rot13Cipher = TextTransformer.toRot13(textVal);

    renderPerformance(executionTimeMs);
    renderMetrics(textVal.length, stegoResult);
    renderEncodings(encodings, hashes, morseCode, rot13Cipher);
    renderHashes(hashes);
    renderFrequencyChart(frequency);
    renderTable(charDetails);
    matrixComp.render(textVal);
  };

  // --- Rendering Functions ---

  function renderHistory() {
    const container = document.getElementById("history-container");
    if (!container) return;

    const items = historyMgr.get();
    if (items.length === 0) {
      container.innerHTML = `<p class="empty-msg">No history items recorded yet.</p>`;
      return;
    }

    container.innerHTML = `
      <div class="history-list">
        ${items
          .map(
            (text, idx) => `
          <div class="history-item">
            <span class="history-text" data-index="${idx}">${escapeHtml(text)}</span>
            <button class="btn-delete-item" data-index="${idx}" title="Delete entry">&times;</button>
          </div>
        `,
          )
          .join("")}
      </div>
    `;

    // Load entry on text click
    container.querySelectorAll(".history-text").forEach((el) => {
      el.addEventListener("click", (e) => {
        const idx = e.target.getAttribute("data-index");
        inputElement.value = items[idx];
        triggerAnalysis(items[idx]);
      });
    });

    // Delete single item click
    container.querySelectorAll(".btn-delete-item").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = parseInt(e.target.getAttribute("data-index"), 10);
        if (typeof historyMgr.delete === "function") {
          historyMgr.delete(idx);
        } else {
          const currentItems = historyMgr.get();
          currentItems.splice(idx, 1);
          localStorage.setItem(
            historyMgr.storageKey,
            JSON.stringify(currentItems),
          );
        }
        renderHistory();
      });
    });
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function renderPerformance(time) {
    const container = document.getElementById("performance-container");
    if (container) {
      container.innerHTML = `<small>Worker Processing Speed: <strong>${time} ms</strong></small>`;
    }
  }

  function renderMetrics(charCount, stego) {
    const container = document.getElementById("metrics-container");
    if (!container) return;
    container.innerHTML = `
      <div class="metrics-grid">
        <div class="metric-card">
          <span>Character Length:</span>
          <strong id="val-char-len">${charCount}</strong>
        </div>
        <div class="metric-card ${stego.hasHiddenChars ? "warning" : ""}">
          <span>Steganography Diagnostic:</span>
          <strong id="val-stego">${stego.hasHiddenChars ? `${stego.hiddenList.length} Hidden Anomaly Found` : "Clean Stream"}</strong>
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
        <div><strong>SHA-1 Digest:</strong> <code>${hashes.sha1}</code></div>
        <div><strong>SHA-256 Digest:</strong> <code>${hashes.sha256}</code></div>
        <div><strong>SHA-512 Digest:</strong> <code>${hashes.sha512}</code></div>
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
      <div class="chart-bars">
        ${freqArray
          .slice(0, 8)
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

  // Initial render on page load
  renderHistory();
});
