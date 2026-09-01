import { ThemeManager } from "../modules/themeManager.js";

export class ThemeToggleComponent {
  constructor(containerElement) {
    this.container = containerElement;
    this.themeManager = new ThemeManager();
  }

  render() {
    this.container.innerHTML = `
      <button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle Theme">
        ${this.themeManager.currentTheme === "dark" ? "☀️" : "🌙"}
      </button>
    `;

    document.getElementById("theme-toggle").addEventListener("click", () => {
      const newTheme = this.themeManager.toggle();
      this.render();
    });
  }
}
