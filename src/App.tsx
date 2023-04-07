import { useState, useEffect } from "react";
import NavLogo from "./images/logo.png";
import {
  DocumentTextIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftOnRectangleIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { MemClient } from "@mem-labs/mem-node";
import createMem from "./utils/createMem";

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [apiKey, setApiKey] = useState<string | undefined>("");
  const [signinApiKey, setSigninApiKey] = useState<string>("");
  const [tab, setTab] = useState<any>({});
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [signinErrorMsg, setSigninErrorMsg] = useState<string | null>("");
  const [memClient, setMemClient] = useState<MemClient | undefined>(undefined);
  const [memSucceeded, setMemSucceeded] = useState<boolean | null>(null); // Null = do not show. false = error, true = success
  const [pageText, setPageText] = useState<string>("");

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

      // Get contents of page with chrome scripting API
      chrome.scripting
        .executeScript({
          target: { tabId: tab.id as number },
          func: () => {
            return document.body.innerText;
          },
        })
        .then(([data]) => {
          if (data.result) {
            setPageText(data.result);
          } else {
            setPageText("Error: Could not get page text");
          }
        });

      setLoading(false);

      return () => {
        // disconnect port on unmount to prevent memory leaks
        port.disconnect();
      };
    }

    getData();
  }, []);

  useEffect(() => {
    if (!apiKey) return;

    const client = new MemClient({
      apiAccessToken: apiKey,
    });

    setMemClient(client);
  }, [apiKey]);

  async function setStorageApiKey() {
    port.postMessage({
      purpose: "setApiKey",
      value: signinApiKey,
    });

    setApiKey(signinApiKey);
  }

  async function removeStorageApiKey() {
    port.postMessage({
      purpose: "removeApiKey",
    });

    setApiKey(undefined);
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

  // Success or failure pages
  if (memSucceeded !== null) {
    if (memSucceeded == true) {
      return <div>success, todo</div>;
    }

    if (memSucceeded == false) {
      return <div>failure, todo</div>;
    }
  }

  if (!apiKey) {
    return (
      <main className="font-work-sans h-[600px] w-[350px] bg-main flex flex-col items-center">
        <nav className="w-full py-1 flex justify-between items-center bg-white px-4">
          <button onClick={() => {}}>
            <img
              src={NavLogo}
              alt="MemAI Logo Button"
              height="50px"
              width="50px"
            />
          </button>
          <a
            href="https://mem.ai/home/recents"
            target="_blank"
            rel="noreferrer"
          >
            <div className="bg-button-dark rounded-md text-white px-3 py-1 text-center text-lg font-bold hover:opacity-90">
              Dashboard
            </div>
          </a>
        </nav>

        <div className="flex flex-col items-center w-full px-4">
          <img
            src={NavLogo}
            alt="Mem Logo"
            height="200px"
            width="200px"
            className="mt-12 "
          />

          <h1 className="text-3xl mt-2">Welcome to Mem!</h1>

          <input
            className="mt-4 h-12 rounded-md border-2 border-gray-300 text-center text-sm font-bold bg-main w-full"
            placeholder="Enter your MemAI API Key"
            value={signinApiKey}
            onChange={(e) => {
              setSigninErrorMsg(null);
              setSigninApiKey(e.target.value);
            }}
          />

          <div className="mt-4 w-full">
            <button
              className="w-full rounded-md text-white py-2 text-xl bg-gradient-to-tr from-button-red to-button-purple hover:from-button-purple hover:to-button-red"
              onClick={async () => {
                if (signinApiKey.length < 25) {
                  setSigninErrorMsg("Error: Invalid API Key");
                  return;
                }
                await setStorageApiKey();
              }}
            >
              Unlock
            </button>

            <p className="text-red-500 text-sm h-4 pt-2 text-center">
              {signinErrorMsg}
            </p>
          </div>

          <div className="flex mt-20 gap-1">
            <p>Don&apos;t have a Mem API Key?</p>

            <a
              href="https://mem.ai/flows/api"
              target="_blank"
              rel="noreferrer"
              className="text-mem-red hover:underline"
            >
              Get one here.
            </a>
          </div>
        </div>
      </main>
    );
  }

  function SettingsPopup() {
    if (!showSettings) return null;

    return (
      <div className="absolute z-50 bg-main mx-4 font-work-sans border-2 border-gray-300 rounded-b-md overflow-hidden">
        <div className="w-full py-2 px-2">
          <h3 className="font-bold text-2xl">About Mem.AI</h3>
          <p className="text-sm mt-1">
            Mem is the world&apos;s first AI-powered workspace that&apos;s
            personalized to you. Amplify your creativity, automate the mundane,
            and stay organized automatically.
          </p>
          <p className="text-sm mt-2 opacity-60">
            Api Key:{" "}
            {apiKey
              ? `${apiKey?.slice(0, 7)}` + "..."
              : "Error: No API Key Found. Please Log Out."}
          </p>
        </div>
        <a href="https://support.mem.ai" target="_blank" rel="noreferrer">
          <div className="w-full border-gray-300 border-t-2 flex justify-start items-center gap-4 px-4 py-3 text-lg hover:bg-slate-200">
            <ChatBubbleLeftRightIcon height="20px" width="20px" />
            Contact Support
          </div>
        </a>
        <button
          className="w-full border-gray-300 border-t-2 flex justify-start items-center gap-4 px-4 py-3 text-lg hover:bg-slate-200 overflow-hidden"
          onClick={async () => await removeStorageApiKey()}
        >
          <ArrowLeftOnRectangleIcon height="20px" width="20px" />
          Log Out
        </button>
      </div>
    );
  }

  return (
    <main className="font-work-sans h-[600px] w-[350px] bg-main flex flex-col justify-between">
      <div className="overflow-y-auto h-[87%] ">
        <nav className="w-full py-1 flex justify-between items-center bg-white px-4 relative">
          <button
            onClick={() => {
              setShowSettings(!showSettings);
            }}
          >
            <img
              src={NavLogo}
              alt="MemAI Logo Button"
              height="50px"
              width="50px"
              className={
                showSettings
                  ? "transition-all duration-500 ease-in-out transform rotate-180"
                  : "transition-all duration-500 ease-in-out transform rotate-0"
              }
            />
          </button>
          <a
            href="https://mem.ai/home/recents"
            target="_blank"
            rel="noreferrer"
          >
            <div className="bg-button-dark rounded-md text-white px-3 py-1 text-center text-lg font-bold hover:opacity-90">
              Dashboard
            </div>
          </a>
        </nav>

        <SettingsPopup />

        {/* Name, url, Tags */}
        <div className="mt-4 flex flex-col mx-4 text-header-text">
          {/* TODO: Button to edit the title, or auto-summarize */}
          <h1 className="text-2xl font-bold">{tab.title}</h1>
          {/* TODO: truncate with ellipsis this url */}
          <h2 className="text-sm mt-2 truncate">{tab.url}</h2>

          {/* Tag input */}
          <div
            className={`flex flex-row justify-between gap-5 items-center ${
              tags.length == 0 && "mb-3"
            }`}
          >
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
                setTags(["#" + tagInput, ...tags]);
                setTagInput("");
              }}
            >
              + Tag
            </button>
          </div>

          {/* Tags, scrollable in the x direction for overflow */}
          {tags.length > 0 && (
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
          )}
        </div>
        {/* Description section */}
        <div className="pt-3 flex flex-col mx-4 text-header-text border-t border-t-header-text">
          <div className="flex w-full justify-between">
            {[
              {
                name: "All",
                icon: PencilIcon,
                func: () => {
                  setDescription(pageText);
                },
              },
              {
                name: "Summarize",
                icon: DocumentTextIcon,
                func: () => {
                  setDescription(
                    "Could not find a good package that summarizes well that would work in a browser extension. Ran out of time :)"
                  );
                },
              },
              {
                name: "Clear",
                icon: TrashIcon,
                func: () => {
                  setDescription("");
                },
              },
            ].map((mode) => (
              <button
                className="px-2 py-1 gap-2 text-sm border border-gray-200 rounded-md font-bold hover:bg-slate-200 flex items-center "
                onClick={mode.func}
              >
                <mode.icon width="16" height="16" />
                {mode.name}
              </button>
            ))}
          </div>

          {/* Input box */}
          <textarea
            className="w-full h-32 mt-3 px-3 py-2 rounded-md text-body-text text-sm bg-main border border-gray-200"
            placeholder="Add Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      {/* FOOTER, ADD MEM BUTTON */}
      <div className="mt-3 flex flex-col mx-4 text-header-text border-t border-t-header-text h-[13%]">
        <button
          className="my-3 w-full rounded-md text-white py-3 text-xl bg-gradient-to-tr from-button-red to-button-purple hover:from-button-purple hover:to-button-red"
          onClick={() =>
            createMem(memClient, tags, tab.title, tab.url, description)
              .then(() => setMemSucceeded(true))
              .catch(() => setMemSucceeded(false))
          }
        >
          Create Mem
        </button>
      </div>
    </main>
  );
}

export default App;

{
  /* <button onClick={async () => await setStorageApiKey("12345abcd")}>
        SET STORAGE API KEY
      </button>
      <br />
      <button onClick={async () => await getStorageApiKey()}>
        GET STORAGE API KEY
      </button>
      <br />

      <p>APIKEY: {apiKey}</p> */
}
