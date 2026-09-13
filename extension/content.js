const posts = Array.from(document.querySelectorAll("p, div"))
  .map((el, i) => ({ el, text: el.innerText, index: i }))
  .filter(item => item.text.trim().length > 30);

posts.forEach(item => {
  chrome.runtime.sendMessage({ action: "classifyPost", text: item.text, index: item.index });
});

const results = [];

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "rankPost") {
    const post = posts.find(p => p.index === msg.index);
    if (post) {
      // Badge + border
      post.el.style.transition = "all 0.5s ease";
      let score = msg.result.score ?? 0;

      if (msg.result.label === "POSITIVE") {
        post.el.style.border = "5px solid green";
        post.el.style.backgroundColor = "rgba(0,255,0,0.1)";
      } else if (msg.result.label === "NEGATIVE") {
        post.el.style.border = "5px solid red";
        post.el.style.backgroundColor = "rgba(255,0,0,0.1)";
      } else {
        post.el.style.border = "5px solid gray";
        post.el.style.backgroundColor = "rgba(128,128,128,0.1)";
      }

      const badge = document.createElement("span");
      badge.innerText = msg.result.label;
      badge.style.cssText = `
        display:inline-block;
        margin:4px;
        padding:2px 6px;
        font-size:12px;
        font-weight:bold;
        color:white;
        border-radius:4px;
      `;
      badge.style.backgroundColor =
        msg.result.label === "POSITIVE" ? "green" :
        msg.result.label === "NEGATIVE" ? "red" : "gray";
      post.el.prepend(badge);

      // Collect results
      results.push({ el: post.el, score });

      if (results.length === posts.length) {
        reorderPosts();
      }
    }
  }
});

function reorderPosts() {
  console.log("Reordering posts…");
  results.sort((a, b) => b.score - a.score);
  const parent = results[0].el.parentNode;
  results.forEach(r => parent.appendChild(r.el));
  console.log("Posts reordered!");
}
