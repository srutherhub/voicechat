import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import App from "./App.tsx";
import { DeviceSettings } from "./pages/settings/DeviceSettings.tsx";
import { AudioPlayer } from "./pages/home/AudioPlayer.tsx";

const root = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="app" element={<App />}>
      <Route path="home" element={<AudioPlayer />} />
        <Route path="settings" element={<DeviceSettings />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
