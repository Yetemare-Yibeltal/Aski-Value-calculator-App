import { ExportService } from "../modules/exportService.js";

export class ExportToolbarComponent {
  constructor(containerElement, getCurrentDataFn) {
    this.container = containerElement;
    this.getCurrentData = getCurrentDataFn;
  }

  render() {
    this.container.innerHTML = `
      <div class="export-toolbar">
        <button id="btn-export-json" class="btn btn-secondary">Export JSON</button>
        <button id="btn-export-csv" class="btn btn-secondary">Export CSV</button>
      </div>
    `;

    document.getElementById("btn-export-json").addEventListener("click", () => {
      const data = this.getCurrentData();
      ExportService.downloadJSON(data);
    });

    document.getElementById("btn-export-csv").addEventListener("click", () => {
      const data = this.getCurrentData();
      ExportService.downloadCSV(data);
    });
  }
}
