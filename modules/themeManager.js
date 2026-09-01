export class ThemeManager {
  constructor() {
    this.themeKey = "app_theme";
    this.currentTheme = localStorage.getItem(this.themeKey) || "dark";
    this.applyTheme(this.currentTheme);
  }

  toggle() {
    this.currentTheme = this.currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem(this.themeKey, this.currentTheme);
    this.applyTheme(this.currentTheme);
    return this.currentTheme;
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }
}
