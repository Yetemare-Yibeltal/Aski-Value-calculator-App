export class HistoryManager {
  constructor(storageKey = "ascii_calc_history", maxItems = 10) {
    this.storageKey = storageKey;
    this.maxItems = maxItems;
  }

  save(text) {
    if (!text || !text.trim()) return;
    let history = this.get();
    history = history.filter((item) => item !== text);
    history.unshift(text);
    if (history.length > this.maxItems) {
      history = history.slice(0, this.maxItems);
    }
    localStorage.setItem(this.storageKey, JSON.stringify(history));
  }

  get() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  clear() {
    localStorage.removeItem(this.storageKey);
  }
}
