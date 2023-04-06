// SET KEY
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "myPort") {
    port.onMessage.addListener((message) => {
      if (message.purpose === "setApiKey") {
        chrome.storage.session.set({ MemApiKey: message.value }, () => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            port.postMessage({
              error: "An error occurred while setting the MemApiKey.",
            });
          } else {
            port.postMessage("set api key");
          }
        });
      }
    });
  }
});

// GET KEY
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "myPort") {
    port.onMessage.addListener((message) => {
      if (message.purpose === "getApiKey") {
        chrome.storage.session.get(["MemApiKey"], (result) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            port.postMessage({
              error: "An error occurred while retrieving the MemApiKey.",
            });
          } else {
            port.postMessage(result);
          }
        });
      }
    });
  }
});

// REMOVE KEY
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "myPort") {
    port.onMessage.addListener((message) => {
      if (message.purpose === "removeApiKey") {
        chrome.storage.session.remove("MemApiKey", () => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            port.postMessage({
              error: "An error occurred while removing the MemApiKey.",
            });
          } else {
            port.postMessage("Removed api key");
          }
        });
      }
    });
  }
});
