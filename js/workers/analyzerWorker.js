self.onmessage = function (e) {
  const { text } = e.data;
  if (text === undefined) return;

  const start = performance.now();

  // Character Encodings & Byte Array Breakdown
  const charDetails = Array.from(text).map((char, index) => {
    const codePoint = char.codePointAt(0);
    const utf8Encoder = new TextEncoder();
    const utf8Bytes = Array.from(utf8Encoder.encode(char))
      .map((b) => "0x" + b.toString(16).toUpperCase().padStart(2, "0"))
      .join(" ");

    return {
      index,
      character:
        char === " " ? "␣ (Space)" : char === "\n" ? "↵ (Line Feed)" : char,
      decimal: codePoint,
      hex: `0x${codePoint.toString(16).toUpperCase()}`,
      binary: codePoint.toString(2).padStart(8, "0"),
      unicode: `U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`,
      utf8Bytes,
    };
  });

  // String Encodings
  const encodings = {
    base64: btoa(unescape(encodeURIComponent(text))),
    urlEncoded: encodeURIComponent(text),
    htmlEntities: text.replace(
      /[\u00A0-\u9999<>&]/g,
      (i) => `&#${i.charCodeAt(0)};`,
    ),
  };

  // Frequency Analysis
  const freqMap = {};
  for (const char of text) {
    freqMap[char] = (freqMap[char] || 0) + 1;
  }
  const frequency = Object.entries(freqMap)
    .map(([char, count]) => ({
      char: char === " " ? "Space" : char,
      count,
      percentage: ((count / text.length) * 100).toFixed(1),
    }))
    .sort((a, b) => b.count - a.count);

  const end = performance.now();

  self.postMessage({
    charDetails,
    encodings,
    frequency,
    executionTimeMs: (end - start).toFixed(2),
  });
};
