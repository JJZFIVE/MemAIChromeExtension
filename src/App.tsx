import { useState, useEffect } from "react";
import { ChromeMessage, Sender } from "./types";

function App() {
  const [apiKey, setApiKey] = useState<string | null>("");
  const [tabinfo, setTabInfo] = useState<{
    title: string | undefined;
    url: string | undefined;
  }>({
    title: undefined,
    url: undefined,
  });
  const [responseFromContent, setResponseFromContent] = useState<string | null>(
    null
  );

  useEffect(() => {
    chrome.tabs &&
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        console.log("TABS", tabs);
        let url = tabs[0]?.url;
        let title = tabs[0]?.title;
        setTabInfo({ title: title, url: url });
      });
  }, []);

  return (
    <main>
      <header className="font-work-sans h-[600px] w-[350px]">
        <nav></nav>
        <h1 className="text-4xl">The self-organizing workspace</h1>
        <p className="font-sans">
          Mem is the world's first AI-powered workspace that's personalized to
          you. Amplify your creativity, automate the mundane, and stay organized
          automatically.
        </p>
        <br />
        <p className="mt-2">{tabinfo.url}</p>
        <p className="mt-2">{tabinfo.title}</p>
      </header>
    </main>
  );
}

export default App;
