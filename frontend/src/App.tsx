import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import { useState, useEffect } from "react";

function App() {
  const [adminMode, setAdminMode] = useState(false);
  const [adminValidated, setAdminValidated] = useState(false);
  const [adminError, setAdminError] = useState("");

  useEffect(() => {
    const validateAdminKey = async () => {
      const queryKey = new URLSearchParams(window.location.search).get("admin_key");
      
      if (!queryKey) {
        setAdminValidated(true);
        return;
      }

      try {
        // Include admin_key in the query string for the validation endpoint
        const url = `/api/admin/validate?admin_key=${encodeURIComponent(queryKey)}`;
        console.log("🔐 Validating admin key...", url);
        
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
          credentials: "include",
        });

        console.log("✅ Validation response status:", response.status);

        if (response.ok) {
          console.log("🎉 Admin access granted!");
          setAdminMode(true);
          setAdminValidated(true);
        } else if (response.status === 401) {
          console.error("❌ Invalid admin key");
          setAdminError("Invalid admin key. Access denied. Please check your URL.");
          setAdminValidated(true);
        } else {
          console.error("❌ Unexpected response:", response.status);
          setAdminError(`Validation failed (${response.status}). Is the backend running?`);
          setAdminValidated(true);
        }
      } catch (error) {
        console.error("🔥 Admin validation error:", error);
        setAdminError("⚠️ Could not reach backend. Is the server running? Check console for details.");
        setAdminValidated(true);
      }
    };

    validateAdminKey();
  }, []);

  if (!adminValidated) {
    return (
      <div className="bg-[#080c14] text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-lg">Validating access...</div>
          <p className="text-gray-400 text-sm mt-4">Check browser console for details</p>
        </div>
      </div>
    );
  }

  if (adminError) {
    return (
      <div className="bg-[#080c14] text-white min-h-screen flex items-center justify-center">
        <div className="text-center max-w-lg p-6">
          <h1 className="text-4xl font-bold mb-4">🚫 Access Denied</h1>
          <p className="text-xl text-red-400 mb-6">{adminError}</p>
          <p className="text-gray-400 mb-4">
            Make sure:
            <br/>• Backend server is running (port 5000)
            <br/>• Admin key in URL matches ADMIN_KEY in .env
            <br/>• Check browser console (F12) for more details
          </p>
          <button
            onClick={() => window.location.href = "/"}
            className="px-6 py-2 bg-amber-400 text-black font-bold rounded hover:bg-amber-300 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (adminMode) {
    return <Admin />;
  }

  return (
    <div className="bg-[#080c14] text-white min-h-screen antialiased">
      <Navbar />
      <Home adminMode={false} />
    </div>
  );
}

export default App;