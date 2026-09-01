export class BitwiseCalculator {
  static performOperations(text) {
    if (!text) return null;

    const firstCharCode = text.charCodeAt(0);
    return {
      originalDecimal: firstCharCode,
      shiftLeft: firstCharCode << 1,
      shiftRight: firstCharCode >> 1,
      notOperation: ~firstCharCode,
      andMask: firstCharCode & 0x0f,
      orMask: firstCharCode | 0xf0,
      xorMask: firstCharCode ^ 0xff,
    };
  }
}
