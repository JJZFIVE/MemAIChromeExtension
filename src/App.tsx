import { useState, useEffect } from "react";
import { setStorageApiKey, getStorageApiKey } from "./utils/storage-fns";
//import summarize from "text-summarization";

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [apiKey, setApiKey] = useState<string | undefined>("");
  const [tab, setTab] = useState<any>({});

  const port = chrome.runtime.connect({ name: "myPort" });

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
      setTab(tab);

      // Get and set API key from storage
      await getStorageApiKey(port, setApiKey);

      setLoading(false);

      return () => {
        // disconnect port
        port.disconnect();
      };
    }

    getData();
  }, []);

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
      <button
        onClick={async () =>
          await setStorageApiKey("12345abcd", port, setApiKey)
        }
      >
        SET STORAGE API KEY
      </button>
      <br />
      <button onClick={async () => await getStorageApiKey(port, setApiKey)}>
        GET STORAGE API KEY
      </button>
      <br />

      <p>APIKEY: {apiKey}</p>
    </main>
  );
}

export default App;
