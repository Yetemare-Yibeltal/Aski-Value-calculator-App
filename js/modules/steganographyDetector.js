export class SteganographyDetector {
  static analyze(text) {
    if (!text) return { hasHiddenChars: false, hiddenList: [] };

    const hiddenPatterns = [
      { name: "Zero-Width Space", codePoint: "U+200B", regex: /\u200B/g },
      { name: "Zero-Width Non-Joiner", codePoint: "U+200C", regex: /\u200C/g },
      { name: "Zero-Width Joiner", codePoint: "U+200D", regex: /\u200D/g },
      { name: "Byte Order Mark (BOM)", codePoint: "U+FEFF", regex: /\uFEFF/g },
      { name: "Soft Hyphen", codePoint: "U+00AD", regex: /\u00AD/g },
    ];

    const hiddenList = [];

    hiddenPatterns.forEach((pattern) => {
      const matches = text.match(pattern.regex);
      if (matches) {
        hiddenList.push({
          name: pattern.name,
          codePoint: pattern.codePoint,
          count: matches.length,
        });
      }
    });

    return {
      hasHiddenChars: hiddenList.length > 0,
      hiddenList,
    };
  }
}
