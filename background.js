chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Perform side effect here
  const data = "Data from side effect";
  console.log("hello");
  sendResponse({ data });
});

// //  PERSISTENT Storage - global, across browsers
// function permanentlyStoreApiKey(key: string) {
//   setApiKey("setting...");
//   chrome.runtime.sendMessage({ message: "getData" }, (response) => {
//     setApiKey(response.data);
//   });
//   // chrome.storage.sync.set({ apiKey: key }, function () {
//   //   //  A data saved callback omg so fancy
//   //   setApiKey(key);
//   // });
// }
