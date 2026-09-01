export class ThemeManager {
  constructor(storageKey = "ascii_app_theme") {
    this.storageKey = storageKey;
  }

  getCurrentTheme() {
    return localStorage.getItem(this.storageKey) || "dark";
  }

  setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(this.storageKey, theme);
  }

  toggleTheme() {
    const nextTheme = this.getCurrentTheme() === "dark" ? "light" : "dark";
    this.setTheme(nextTheme);
    return nextTheme;
  }
}
