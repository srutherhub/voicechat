import "./App.css";
import { useConnectMediaDevices } from "./utils/useConnectMediaDevices";

function App() {
  useConnectMediaDevices();
  return <div>Hello from app</div>;
}

export default App;
