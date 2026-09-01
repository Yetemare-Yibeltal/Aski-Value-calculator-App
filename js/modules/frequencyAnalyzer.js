export class FrequencyAnalyzer {
  static analyze(input) {
    if (!input) return [];

    const map = new Map();
    for (const char of input) {
      map.set(char, (map.get(char) || 0) + 1);
    }

    const total = input.length;
    const sorted = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);

    return sorted.map(([char, count]) => ({
      character: char === " " ? "␣ (Space)" : char,
      count,
      percentage: ((count / total) * 100).toFixed(1),
    }));
  }
}
