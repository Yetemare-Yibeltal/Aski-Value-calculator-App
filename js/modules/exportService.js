export class ExportService {
  static exportToJSON(data, filename = "ascii-analysis.json") {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  static exportToCSV(data, filename = "ascii-analysis.csv") {
    if (!data || !data.length) return;
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) =>
      Object.values(row)
        .map((val) => `"${val}"`)
        .join(","),
    );
    const csvContent = `data:text/csv;charset=utf-8,${encodeURIComponent([headers, ...rows].join("\n"))}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", csvContent);
    downloadAnchor.setAttribute("download", filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
}
