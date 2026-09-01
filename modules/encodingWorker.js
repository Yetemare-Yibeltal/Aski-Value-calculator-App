import { ConversionEngine } from "./conversionEngine.js";
import { SummaryMetrics } from "./summaryMetrics.js";
import { FrequencyAnalyzer } from "./frequencyAnalyzer.js";

self.onmessage = function (e) {
  const { text } = e.data;
  const charData = ConversionEngine.analyzeString(text);
  const metricsData = SummaryMetrics.calculate(charData);
  const freqData = FrequencyAnalyzer.analyze(text);

  self.postMessage({
    charData,
    metricsData,
    freqData,
  });
};
