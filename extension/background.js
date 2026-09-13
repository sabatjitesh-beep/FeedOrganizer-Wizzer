chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.action === "classifyPost") {
    fetch("http://localhost:8000/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: msg.text })
    })
    .then(async res => {
      try {
        const data = await res.json(); // expect JSON
        chrome.tabs.sendMessage(sender.tab.id, {
          action: "rankPost",
          index: msg.index,
          result: data
        });
      } catch (err) {
        // fallback if backend fails
        console.error("Backend error:", await res.text());
        chrome.tabs.sendMessage(sender.tab.id, {
          action: "rankPost",
          index: msg.index,
          result: { label: "NEUTRAL", score: 0 }
        });
      }
    })
    .catch(err => console.error("Error calling backend:", err));
  }
});
