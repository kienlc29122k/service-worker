// import { useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  // registerServiceWorker,
  unregisterServiceWorker,
} from "./serviceWorkerRegistration";
import Dropdown from "./components/Dropdown";

function App() {
  // const [count, setCount] = useState(0);

  // useEffect(() => {
  //   registerServiceWorker();
  // }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={unregisterServiceWorker} type="button">
          Unregister Service Worker
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <Dropdown />
    </>
  );
}

export default App;
