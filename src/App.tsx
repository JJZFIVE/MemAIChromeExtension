import { useState, useEffect } from "react";

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [apiKey, setApiKey] = useState<string | null>("");
  const [tab, setTab] = useState<any>({});

  async function getTabs() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

  useEffect(() => {
    async function getData() {
      // Get tab data: this only wanted to work in useEffect
      setLoading(true);
      const tab = await getTabs();
      console.log(tab);
      setTab(tab);

      // Get API key from storage
      await getStorageApiKey();

      setLoading(false);
    }

    getData();
  }, []);

  async function setStorageApiKey(value: string) {
    const port = chrome.runtime.connect({ name: "myPort" });
    port.postMessage({
      purpose: "setApiKey",
      value: value,
    });

    setApiKey(value);
  }

  async function getStorageApiKey() {
    const port = chrome.runtime.connect({ name: "myPort" });
    port.postMessage({ purpose: "getApiKey" });
    port.onMessage.addListener((response) => {
      setApiKey(response["MemApiKey"]);
    });
  }

  if (loading)
    return (
      <main className="font-work-sans h-[600px] w-[350px]">Loading...</main>
    );

  return (
    <main className="font-work-sans h-[600px] w-[350px]">
      <nav></nav>
      <h1 className="text-4xl">The self-organizing workspace</h1>
      <p className="font-sans">
        Mem is the world's first AI-powered workspace that's personalized to
        you. Amplify your creativity, automate the mundane, and stay organized
        automatically.
      </p>

      <p className="mt-2">{tab.url}</p>
      <p className="mt-2">{tab.title}</p>
      <button onClick={async () => await setStorageApiKey("12345abcd")}>
        SET STORAGE API KEY
      </button>
      <br />
      <button onClick={async () => await getStorageApiKey()}>
        GET STORAGE API KEY
      </button>
      <br />

      <p>APIKEY: {apiKey}</p>
    </main>
  );
}

export default App;
