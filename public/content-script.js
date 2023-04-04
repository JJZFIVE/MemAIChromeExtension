// This is unneccessary

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.purpose === "hello") {
    console.log("received");
    sendResponse({ farewell: "goodbye" });
  }
});
