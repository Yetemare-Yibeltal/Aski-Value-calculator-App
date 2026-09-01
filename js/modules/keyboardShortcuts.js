export class KeyboardShortcuts {
  static init(handlers) {
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (handlers.onFocusInput) handlers.onFocusInput();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "e") {
        e.preventDefault();
        if (handlers.onExport) handlers.onExport();
      }
    });
  }
}
