// This is unneccessary

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.purpose === "hello") {
    console.log("received");
    sendResponse({ farewell: "goodbye" });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("CONTENTS RECEIVED");
  if (request.purpose === "getContents") {
    const content = document.body.innerText;
    sendResponse({ content });
  }
});
