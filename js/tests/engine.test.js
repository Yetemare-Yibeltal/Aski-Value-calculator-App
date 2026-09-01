import { ConversionEngine } from "../modules/conversionEngine.js";
import { SummaryMetrics } from "../modules/summaryMetrics.js";
import { HashCalculator } from "../modules/hashCalculator.js";

function assertEqual(actual, expected, testName) {
  if (actual === expected) {
    console.log(`[PASS] ${testName}`);
  } else {
    console.error(`[FAIL] ${testName} - Expected: ${expected}, Got: ${actual}`);
  }
}

console.log("--- Running Application Unit Tests ---");

// Test 1: Conversion Engine Single Char
const resultA = ConversionEngine.analyzeString("A");
assertEqual(resultA[0].decimal, 65, 'ASCII decimal conversion for "A"');
assertEqual(resultA[0].hexadecimal, "41", 'Hex conversion for "A"');
assertEqual(resultA[0].binary, "01000001", 'Binary conversion for "A"');

// Test 2: Summary Metrics
const metrics = SummaryMetrics.calculate(resultA);
assertEqual(metrics.totalChars, 1, "Total character count metric");
assertEqual(metrics.sumAscii, 65, "ASCII sum metric");

// Test 3: Checksum Engine
const checksum = HashCalculator.simpleChecksum("Test");
assertEqual(typeof checksum, "number", "Checksum output type verification");

console.log("--- Tests Complete ---");
