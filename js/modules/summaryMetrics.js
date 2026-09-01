export class SummaryMetrics {
  static calculate(charDataArray) {
    if (!charDataArray || charDataArray.length === 0) {
      return {
        totalChars: 0,
        totalWords: 0,
        sumAscii: 0,
        avgAscii: 0,
        highestAscii: 0,
        lowestAscii: 0,
      };
    }

    const totalChars = charDataArray.length;
    let sumAscii = 0;
    let highestAscii = -Infinity;
    let lowestAscii = Infinity;

    charDataArray.forEach((item) => {
      const val = item.decimal;
      sumAscii += val;
      if (val > highestAscii) highestAscii = val;
      if (val < lowestAscii) lowestAscii = val;
    });

    const nonSpaceText = charDataArray.map((i) => i.character).join("");
    const totalWords = nonSpaceText.trim()
      ? nonSpaceText.trim().split(/\s+/).length
      : 0;

    return {
      totalChars,
      totalWords,
      sumAscii,
      avgAscii: (sumAscii / totalChars).toFixed(2),
      highestAscii: highestAscii === -Infinity ? 0 : highestAscii,
      lowestAscii: lowestAscii === Infinity ? 0 : lowestAscii,
    };
  }
}
