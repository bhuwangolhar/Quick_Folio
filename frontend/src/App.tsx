import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import ErrorPage from "./components/ErrorPage";
import ServerWarmupLoader from "./components/ServerWarmupLoader";
import { useState, useEffect } from "react";
import { fetchProfile } from "./services/api";

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
  const [isServerReady, setIsServerReady] = useState(false);
  const [serverError, setServerError] = useState(false);

  // Preload backend to wake it up ASAP
  useEffect(() => {
    const preloadBackend = async () => {
      const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      try {
        await fetch(`${apiBaseUrl}/profile`, { signal: AbortSignal.timeout(30000) });
      } catch {
        // Silent fail - will retry on main fetch
      }
    };
    preloadBackend();
  }, []);

  // Load essential data with retry logic
  useEffect(() => {
    const loadEssentialData = async () => {
      try {
        await fetchProfile();
        setIsServerReady(true);
      } catch {
        setServerError(true);
        setIsServerReady(true);
      }
    };

    loadEssentialData();
  }, []);

  useEffect(() => {
    const validateAdminKey = async () => {
      const queryKey = new URLSearchParams(window.location.search).get("admin_key");
      
      if (!queryKey) {
        setAdminValidated(true);
        return;
      }

      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const url = `${apiBaseUrl}/admin/validate?admin_key=${encodeURIComponent(queryKey)}`;
        console.log("🔐 Validating admin key...", url);
        
        const response = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        console.log("✅ Validation response status:", response.status);

        if (response.ok) {
          console.log("🎉 Admin access granted!");
          setAdminMode(true);
          setAdminValidated(true);
        } else if (response.status === 403) {
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

    // Wait for server to be ready before validating admin key
    if (isServerReady) {
      validateAdminKey();
    }
  }, [isServerReady]);

  // Show loading screen while server is waking up
  if (!isServerReady) {
    return <ServerWarmupLoader isLoading={!isServerReady} />;
  }

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

  if (serverError && !adminMode) {
    return (
      <ErrorPage
        title="Server Unavailable"
        message="Server is taking longer than expected. Please refresh the page in a moment."
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