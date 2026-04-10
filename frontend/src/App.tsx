import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import ErrorPage from "./components/ErrorPage";
import ServerWarmupLoader from "./components/ServerWarmupLoader";
import { useState, useEffect } from "react";
import { fetchProfile } from "./services/api";
import { fetchWithRetry } from "./utils/fetchWithRetry";

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
        await fetchWithRetry(
          () => fetch(`${apiBaseUrl}/profile`, { signal: AbortSignal.timeout(5000) }),
          3,
          1000
        );
      } catch {
        // Silent fail - main fetch will retry anyway
      }
    };
    preloadBackend();
  }, []);

  // Load essential data with retry logic (NO immediate error)
  useEffect(() => {
    let isMounted = true;
    let timeout: ReturnType<typeof setTimeout>;

    const loadEssentialData = async () => {
      try {
        await fetchProfile();
        if (isMounted) {
          setIsServerReady(true);
        }
      } catch {
        // Don't show error immediately - let it stay in loading
        if (isMounted) {
          setIsServerReady(true);
          setServerError(true);
        }
      }
    };

    // Start loading attempt
    loadEssentialData();

    // Timeout: Only show error after 90 seconds if still loading
    timeout = setTimeout(() => {
      if (isMounted && !isServerReady) {
        setIsServerReady(true);
        setServerError(true);
      }
    }, 90000);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const validateAdminKey = async () => {
      const queryKey = new URLSearchParams(window.location.search).get("admin_key");
      
      if (!queryKey) {
        if (isMounted) setAdminValidated(true);
        return;
      }

      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const url = `${apiBaseUrl}/admin/validate?admin_key=${encodeURIComponent(queryKey)}`;
        console.log("🔐 Validating admin key...", url);
        
        const response = await fetchWithRetry(
          () =>
            fetch(url, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            }),
          5,
          2000
        );

        console.log("✅ Validation response status:", response.status);

        if (response.ok) {
          console.log("🎉 Admin access granted!");
          if (isMounted) {
            setAdminMode(true);
            setAdminValidated(true);
          }
        } else if (response.status === 403) {
          console.error("❌ Invalid admin key");
          if (isMounted) {
            setAdminError("Invalid admin key. Access denied. Please check your URL.");
            setAdminValidated(true);
          }
        } else {
          console.error("❌ Unexpected response:", response.status);
          if (isMounted) {
            setAdminError(`Validation failed (${response.status}). Is the backend running?`);
            setAdminValidated(true);
          }
        }
      } catch (error) {
        console.error("🔥 Admin validation error:", error);
        if (isMounted) {
          setAdminError("⚠️ Could not reach backend. Please try again in a moment.");
          setAdminValidated(true);
        }
      }
    };

    // Wait for server to be ready before validating admin key
    if (isServerReady) {
      validateAdminKey();
    }

    return () => {
      isMounted = false;
    };
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
        title="Connecting the servers ..."
        message="Thank you for your patience! Please just wait a moment while we’re preparing for your smooth experience."
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