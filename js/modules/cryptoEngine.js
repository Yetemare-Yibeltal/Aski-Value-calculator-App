export class CryptoEngine {
  static async generateHashes(text) {
    if (!text) return { sha1: "-", sha256: "-", sha512: "-" };

    const msgUint8 = new TextEncoder().encode(text);

    const [buffer256, buffer512, buffer1] = await Promise.all([
      crypto.subtle.digest("SHA-256", msgUint8),
      crypto.subtle.digest("SHA-512", msgUint8),
      crypto.subtle.digest("SHA-1", msgUint8),
    ]);

    return {
      sha1: this.toHex(buffer1),
      sha256: this.toHex(buffer256),
      sha512: this.toHex(buffer512),
    };
  }

  static toHex(buffer) {
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
}
