export class HashCalculator {
  static generateSimpleHash(input) {
    if (!input) return "0x00000000";
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `0x${(hash >>> 0).toString(16).toUpperCase().padStart(8, "0")}`;
  }
}
