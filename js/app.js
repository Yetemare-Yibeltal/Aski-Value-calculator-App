import { ConversionEngine } from "./modules/conversionEngine.js";

document.addEventListener("DOMContentLoaded", () => {
  const inputElement = document.getElementById("text-input");
  const resultsContainer = document.getElementById("results-container");

  inputElement.addEventListener("input", (event) => {
    const text = event.target.value;
    const analytics = ConversionEngine.analyzeString(text);
    resultsContainer.textContent = JSON.stringify(analytics, null, 2);
  });
});
