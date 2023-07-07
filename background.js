let contentScriptLoaded = false;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.command === "contentScriptLoaded") {
      contentScriptLoaded = true;
    }
});

// Modify your existing activate code
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.command === "activate") {
      if (!contentScriptLoaded) {
        setTimeout(function() {
          chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { command: "activate" });
          });
        }, 1000); // Wait for 1 second
      } else {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { command: "activate" });
        });
      }
    }
});
