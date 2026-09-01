export class BinaryTranslator {
  static textToBinary(text) {
    return Array.from(text)
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
      .join(" ");
  }

  static binaryToText(binaryStr) {
    return binaryStr
      .trim()
      .split(/\s+/)
      .map((bin) => String.fromCharCode(parseInt(bin, 2)))
      .join("");
  }
}
