export class BitwiseCalculator {
  static calculateOperations(input) {
    if (!input) return { and: 0, or: 0, xor: 0 };
    const charCodes = Array.from(input).map((char) => char.codePointAt(0));

    let andResult = charCodes[0];
    let orResult = charCodes[0];
    let xorResult = charCodes[0];

    for (let i = 1; i < charCodes.length; i++) {
      andResult &= charCodes[i];
      orResult |= charCodes[i];
      xorResult ^= charCodes[i];
    }

    return {
      and: andResult.toString(2).padStart(8, "0"),
      or: orResult.toString(2).padStart(8, "0"),
      xor: xorResult.toString(2).padStart(8, "0"),
    };
  }
}
