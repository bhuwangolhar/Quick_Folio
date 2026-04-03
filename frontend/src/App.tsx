import Navbar from "./components/Navbar";
import Home from "./pages/Home";

const ADMIN_KEY = "quickfolio-admin-secret";
const queryKey = new URLSearchParams(window.location.search).get("admin_key");

function App() {
  const adminMode = queryKey === ADMIN_KEY;

  return (
    <div className="bg-[#080c14] text-white min-h-screen antialiased">
      <Navbar />
      <Home adminMode={adminMode} />
    </div>
  );
}

export default App;