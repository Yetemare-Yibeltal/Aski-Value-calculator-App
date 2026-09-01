export class ConversionEngine {
  static analyzeString(input) {
    if (!input) return { charData: [], entropy: 0, nonPrintableCount: 0 };

    let nonPrintableCount = 0;

    const charData = Array.from(input).map((char, index) => {
      const codePoint = char.codePointAt(0);
      const isControl = codePoint < 32 || codePoint === 127;
      if (isControl || (codePoint >= 0x200b && codePoint <= 0x200d))
        nonPrintableCount++;

      return {
        index: index + 1,
        character: this.getDisplayChar(char, codePoint),
        rawChar: char,
        asciiCode: codePoint <= 127 ? codePoint : "N/A (Unicode)",
        unicodePoint: `U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`,
        decimal: codePoint,
        hexadecimal: `0x${codePoint.toString(16).toUpperCase()}`,
        binary: codePoint.toString(2).padStart(8, "0"),
        octal: `0o${codePoint.toString(8)}`,
        category: this.getCharacterCategory(codePoint),
        utf8Bytes: new TextEncoder().encode(char).length,
      };
    });

    const entropy = this.calculateEntropy(input);

    return { charData, entropy, nonPrintableCount };
  }

  static getDisplayChar(char, code) {
    const controlCodes = {
      0: "NUL (Null)",
      8: "BS (Backspace)",
      9: "TAB (Tab)",
      10: "LF (Line Feed)",
      13: "CR (Carriage Return)",
      32: "␣ (Space)",
      127: "DEL (Delete)",
    };
    return controlCodes[code] || char;
  }

  static getCharacterCategory(code) {
    if (code < 32 || code === 127) return "Control Code";
    if (code >= 48 && code <= 57) return "Numeric Digit";
    if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122))
      return "ASCII Alphabetic";
    if (code <= 127) return "ASCII Punctuation/Symbol";
    return "Extended Unicode";
  }

  static calculateEntropy(str) {
    const len = str.length;
    if (len === 0) return 0;
    const frequencies = {};
    for (const char of str) {
      frequencies[char] = (frequencies[char] || 0) + 1;
    }
    return Object.values(frequencies)
      .reduce((sum, count) => {
        const p = count / len;
        return sum - p * Math.log2(p);
      }, 0)
      .toFixed(4);
  }
}
