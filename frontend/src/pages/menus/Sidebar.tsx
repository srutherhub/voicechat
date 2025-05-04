import { useNavigate } from "react-router";

export function Sidebar() {
  const Nav = useNavigate();

  return (
    <div
    className="sidebar-container"
    >
      <button onClick={() => Nav("/app/home")}>Home</button>
      <button onClick={() => Nav("/app/settings")}>Settings</button>
    </div>
  );
}
