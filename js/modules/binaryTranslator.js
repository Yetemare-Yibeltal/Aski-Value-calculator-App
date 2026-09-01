export class BinaryTranslator {
  static toBinaryStream(input) {
    if (!input) return "";
    return Array.from(input)
      .map((char) => char.codePointAt(0).toString(2).padStart(8, "0"))
      .join(" ");
  }
}
