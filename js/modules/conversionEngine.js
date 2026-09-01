export class ConversionEngine {
  static analyzeString(input) {
    if (!input) return [];

    return Array.from(input).map((char) => {
      const codePoint = char.codePointAt(0);
      return {
        character: char,
        asciiCode: codePoint <= 127 ? codePoint : null,
        unicodePoint: `U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`,
        decimal: codePoint,
        hexadecimal: codePoint.toString(16).toUpperCase(),
        binary: codePoint.toString(2).padStart(8, "0"),
        octal: codePoint.toString(8),
      };
    });
  }
}
