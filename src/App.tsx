import { useState, useEffect } from "react";
import NavLogo from "./images/logo.png";

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [apiKey, setApiKey] = useState<string | undefined>("");
  const [tab, setTab] = useState<any>({});
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");

  const port = chrome.runtime.connect({ name: "myPort" });

  async function getTabs() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    console.log(tab);
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

      return () => {
        // disconnect port
        port.disconnect();
      };
    }

    getData();
  }, []);

  async function setStorageApiKey(value: string) {
    port.postMessage({
      purpose: "setApiKey",
      value: value,
    });

    setApiKey(value);
  }

  async function getStorageApiKey() {
    port.postMessage({ purpose: "getApiKey" });
    port.onMessage.addListener(
      (response: { MemApiKey: string } | undefined) => {
        setApiKey(response?.["MemApiKey"]);
      }
    );
  }

  if (loading)
    return (
      <main className="font-work-sans h-[600px] w-[350px]">Loading...</main>
    );

  return (
    <main className="font-work-sans h-[600px] w-[350px] bg-main">
      <nav className="w-full py-1 flex justify-between items-center bg-white px-4">
        <button onClick={() => {}}>
          <img
            src={NavLogo}
            alt="MemAI Logo Button"
            height="50px"
            width="50px"
          />
        </button>
        <a href="https://mem.ai/home/recents" target="_blank" rel="noreferrer">
          <div className="bg-button-dark rounded-md text-white px-3 py-1 text-center text-lg font-bold hover:opacity-90">
            Dashboard
          </div>
        </a>
      </nav>

      {/* Name, url, Tags */}
      <div className="mt-4 flex flex-col mx-4 text-header-text">
        <h1 className="text-2xl font-bold">{tab.title}</h1>
        <h2 className="text-xl mt-4">{tab.url}</h2>

        {/* Tag input */}
        <div className="flex flex-row justify-between gap-5 items-center">
          <div className="relative my-2 w-2/3 border justify-center flex items-center rounded-md shadow-md bg-tag">
            <div className="w-8 text-center text-body-text text-lg border-r border-gray-400">
              #
            </div>
            <input
              className="text-sm bg-tag w-full h-8 px-3 py-1 rounded-md text-body-text"
              placeholder="Tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
            />
          </div>
          <button
            className="bg-button-dark rounded-md text-white w-1/4 h-8 text-center text-sm hover:opacity-90 border"
            onClick={() => {
              if (tagInput == "" || tags.includes("#" + tagInput)) return;
              setTags([...tags, "#" + tagInput]);
              setTagInput("");
            }}
          >
            + Tag
          </button>
        </div>

        {/* Tags, scrollable in the x direction for overflow */}
        <div className="mt-2 pb-4 flex flex-row overflow-x-auto gap-2">
          {tags.map((tag: string) => (
            <button
              className="bg-tag rounded-md text-body-text px-3 py-1 text-center text-sm font-bold hover:opacity-70"
              onClick={() => setTags(tags.filter((t) => t !== tag))}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <p className="font-sans">
        Mem is the world's first AI-powered workspace that's personalized to
        you. Amplify your creativity, automate the mundane, and stay organized
        automatically.
      </p>

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
