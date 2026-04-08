import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import ErrorPage from "./components/ErrorPage";
import { useState, useEffect } from "react";

function App() {
  // 🔒 ROUTE GUARD: Block any path that's not "/"
  const isValidPath = window.location.pathname === "/";
  if (!isValidPath) {
    return (
      <ErrorPage
        title="Access Denied"
        message="Invalid route. Only the root path (/) is accessible."
        isDev={import.meta.env.DEV}
      />
    );
  }

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
        // 🔒 Use environment variable for API URL to prevent hardcoded backend URLs
        const apiBaseUrl = import.meta.env.VITE_API_URL || "/api";
        const url = `${apiBaseUrl}/admin/validate?admin_key=${encodeURIComponent(queryKey)}`;
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
      <ErrorPage
        title="Access Denied"
        message={adminError}
        isDev={import.meta.env.DEV}
      />
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