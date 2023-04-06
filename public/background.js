import constants from "../src/constants";

// SET KEY
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "MemAIPortname") {
    port.onMessage.addListener((message) => {
      if (message.purpose === "setApiKey") {
        chrome.storage.session.set({ MemApiKey: message.value }, () => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            port.postMessage({
              error: "An error occurred while setting the MemApiKey.",
            });
          } else {
            console.log("set key");
            port.postMessage("set api key");
          }
        });
      }
    });
  }
});

// GET KEY
chrome.runtime.onConnect.addListener((port) => {
  console.log("here 0");
  if (port.name === "MemAIPortname") {
    console.log("here 1");
    port.onMessage.addListener((message) => {
      if (message.purpose === "getApiKey") {
        console.log("here 1");
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
