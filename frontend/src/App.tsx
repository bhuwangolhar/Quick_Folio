import Navbar from "./components/Navbar";
import Home from "./pages/Home";

// Admin key is validated server-side, frontend just checks if a key is present
const queryKey = new URLSearchParams(window.location.search).get("admin_key");

function App() {
  const adminMode = !!queryKey; // Server validates the actual key

  return (
    <div className="bg-[#080c14] text-white min-h-screen antialiased">
      <Navbar />
      <Home adminMode={adminMode} />
    </div>
  );
}

export default App;