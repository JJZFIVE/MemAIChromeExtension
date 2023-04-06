async function setStorageApiKey(
  value: string,
  port: any,
  setApiKey: (value: string | undefined) => void
) {
  port.postMessage({
    purpose: "setApiKey",
    value: value,
  });

  setApiKey(value);
}

async function getStorageApiKey(
  port: any,
  setApiKey: (value: string | undefined) => void
) {
  port.postMessage({ purpose: "getApiKey" });
  port.onMessage.addListener((response: { MemApiKey: string } | undefined) => {
    setApiKey(response?.["MemApiKey"]);
  });
}

export { setStorageApiKey, getStorageApiKey };
