import { ConversionEngine } from "./modules/conversionEngine.js";
import { SummaryMetrics } from "./modules/summaryMetrics.js";
import { FrequencyAnalyzer } from "./modules/frequencyAnalyzer.js";
import { HistoryManager } from "./modules/historyManager.js";
import { PerformanceTracker } from "./modules/performanceTracker.js";
import { KeyboardShortcuts } from "./modules/keyboardShortcuts.js";

import { MetricsCardComponent } from "./components/metricsCard.js";
import { CharacterTableComponent } from "./components/characterTable.js";
import { FrequencyChartComponent } from "./components/frequencyChart.js";
import { ExportToolbarComponent } from "./components/exportToolbar.js";
import { HistoryViewComponent } from "./components/historyView.js";
import { ThemeToggleComponent } from "./components/themeToggle.js";
import { BinaryConverterViewComponent } from "./components/binaryConverterView.js";
import { BitwiseViewComponent } from "./components/bitwiseView.js";
import { HashViewComponent } from "./components/hashView.js";
import { PerformanceBannerComponent } from "./components/performanceBanner.js";
import { SampleSelectorComponent } from "./components/sampleSelector.js";

document.addEventListener("DOMContentLoaded", () => {
  const inputElement = document.getElementById("text-input");
  let currentAnalysisData = [];

  const themeToggleComp = new ThemeToggleComponent(
    document.getElementById("theme-container"),
  );
  const metricsComp = new MetricsCardComponent(
    document.getElementById("metrics-container"),
  );
  const tableComp = new CharacterTableComponent(
    document.getElementById("table-container"),
  );
  const freqComp = new FrequencyChartComponent(
    document.getElementById("frequency-container"),
  );
  const binaryComp = new BinaryConverterViewComponent(
    document.getElementById("binary-container"),
  );
  const bitwiseComp = new BitwiseViewComponent(
    document.getElementById("bitwise-container"),
  );
  const hashComp = new HashViewComponent(
    document.getElementById("hash-container"),
  );
  const perfComp = new PerformanceBannerComponent(
    document.getElementById("performance-container"),
  );
  const historyMgr = new HistoryManager();

  themeToggleComp.render();

  const historyComp = new HistoryViewComponent(
    document.getElementById("history-container"),
    (selectedText) => {
      inputElement.value = selectedText;
      processInput(selectedText);
    },
  );

  const sampleComp = new SampleSelectorComponent(
    document.getElementById("sample-container"),
    (sampleText) => {
      inputElement.value = sampleText;
      processInput(sampleText);
    },
  );

  const exportComp = new ExportToolbarComponent(
    document.getElementById("export-container"),
    () => currentAnalysisData,
  );

  sampleComp.render();
  exportComp.render();
  historyComp.render(historyMgr.get());

  function processInput(text) {
    const perfResult = PerformanceTracker.measure(() => {
      const charData = ConversionEngine.analyzeString(text);
      const metricsData = SummaryMetrics.calculate(charData);
      const freqData = FrequencyAnalyzer.analyze(text);
      return { charData, metricsData, freqData };
    });

    currentAnalysisData = perfResult.result.charData;

    perfComp.render(perfResult.executionTimeMs);
    metricsComp.render(perfResult.result.metricsData);
    freqComp.render(perfResult.result.freqData);
    tableComp.render(perfResult.result.charData);
    binaryComp.render(text);
    bitwiseComp.render(text);
    hashComp.render(text);

    if (text.trim()) {
      historyMgr.save(text);
      historyComp.render(historyMgr.get());
    }
  }

  inputElement.addEventListener("input", (e) => {
    processInput(e.target.value);
  });

  KeyboardShortcuts.init({
    onFocusInput: () => inputElement.focus(),
    onExport: () => document.getElementById("btn-export-json")?.click(),
  });
});
