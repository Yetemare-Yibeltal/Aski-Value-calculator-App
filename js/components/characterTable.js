export class CharacterTableComponent {
  constructor(containerElement) {
    this.container = containerElement;
  }

  render(dataArray) {
    if (!dataArray || dataArray.length === 0) {
      this.container.innerHTML =
        '<p class="empty-state">No character data to display.</p>';
      return;
    }

    const rowsHtml = dataArray
      .map(
        (item) => `
      <tr>
        <td class="char-cell">${item.character === " " ? "␣ (Space)" : item.character}</td>
        <td>${item.asciiCode !== null ? item.asciiCode : "N/A"}</td>
        <td>${item.unicodePoint}</td>
        <td>${item.decimal}</td>
        <td>0x${item.hexadecimal}</td>
        <td>${item.binary}</td>
        <td>${item.octal}</td>
      </tr>
    `,
      )
      .join("");

    this.container.innerHTML = `
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Char</th>
              <th>ASCII</th>
              <th>Unicode</th>
              <th>DEC</th>
              <th>HEX</th>
              <th>BIN</th>
              <th>OCT</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  }
}
