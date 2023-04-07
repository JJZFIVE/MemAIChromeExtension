import NavLogo from "../images/logo.png";
export default function Navbar({
  showSettings,
  setShowSettings,
  allowShowSettings,
}: {
  showSettings: boolean;
  setShowSettings: (showSettings: boolean) => void;
  allowShowSettings: boolean;
}) {
  if (!allowShowSettings) {
    return (
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
    );
  }

  return (
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
      <a href="https://mem.ai/home/recents" target="_blank" rel="noreferrer">
        <div className="bg-button-dark rounded-md text-white px-3 py-1 text-center text-lg font-bold hover:opacity-90">
          Dashboard
        </div>
      </a>
    </nav>
  );
}
