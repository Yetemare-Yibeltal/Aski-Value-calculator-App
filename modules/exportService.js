export class ExportService {
  static downloadJSON(data, filename = "ascii-analysis.json") {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    this.triggerDownload(blob, filename);
  }

  static downloadCSV(data, filename = "ascii-analysis.csv") {
    if (!data || data.length === 0) return;

    const headers = [
      "Character",
      "ASCII",
      "Unicode",
      "Decimal",
      "Hexadecimal",
      "Binary",
      "Octal",
    ];
    const rows = data.map((item) => [
      `"${item.character.replace(/"/g, '""')}"`,
      item.asciiCode !== null ? item.asciiCode : "",
      item.unicodePoint,
      item.decimal,
      item.hexadecimal,
      item.binary,
      item.octal,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((e) => e.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    this.triggerDownload(blob, filename);
  }

  static triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
0