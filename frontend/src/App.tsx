import "./App.css";
import { DeviceProvider } from "./pages/settings/DeviceContext";
import { Outlet } from "react-router";
import { Sidebar } from "./pages/menus/Sidebar";
import { CallMenu } from "./pages/menus/CallMenu";

function App() {

  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: "100vh",
      }}
    >
      <DeviceProvider>
        <div className="app-container">
          <Sidebar />
          <div>
            <CallMenu />
            <Outlet />
          </div>
        </div>
      </DeviceProvider>
    </div>
  );
}

export default App;

