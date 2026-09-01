export class TextTransformer {
  static toMorseCode(text) {
    const morseMap = {
      A: ".-",
      B: "-...",
      C: "-.-.",
      D: "-..",
      E: ".",
      F: "..-.",
      G: "--.",
      H: "....",
      I: "..",
      J: ".---",
      K: "-.-",
      L: ".-..",
      M: "--",
      N: "-.",
      O: "---",
      P: ".--.",
      Q: "--.-",
      R: ".-.",
      S: "...",
      T: "-",
      U: "..-",
      V: "...-",
      W: ".--",
      X: "-..-",
      Y: "-.--",
      Z: "--..",
      1: ".----",
      2: "..---",
      3: "...--",
      4: "....-",
      5: ".....",
      6: "-....",
      7: "--...",
      8: "---..",
      9: "----.",
      0: "-----",
      " ": "/",
    };
    return text
      .toUpperCase()
      .split("")
      .map((char) => morseMap[char] || char)
      .join(" ");
  }

  static toRot13(text) {
    return text.replace(/[a-zA-Z]/g, (c) =>
      String.fromCharCode(
        (c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26,
      ),
    );
  }
}
