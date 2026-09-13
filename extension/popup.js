document.getElementById("analyze").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "analyzeFeed" });
});
