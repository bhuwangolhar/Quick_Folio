import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import ErrorPage from "./components/ErrorPage";
import ServerWarmupLoader from "./components/ServerWarmupLoader";
import { fetchProfile } from "./services/api";
import { fetchWithRetry } from "./utils/fetchWithRetry";

function App() {
  // 🌐 Environment Configuration
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

  // 📌 State Management
  const [adminMode, setAdminMode] = useState<boolean>(false);
  const [adminValidated, setAdminValidated] = useState<boolean>(false);
  const [adminError, setAdminError] = useState<string>("");
  const [isServerReady, setIsServerReady] = useState<boolean>(false);
  const [serverError, setServerError] = useState<boolean>(false);

  // 🚀 Preload backend to wake it up ASAP
  useEffect(() => {
    const preloadBackend = async () => {
      try {
        await fetchWithRetry(
          () =>
            fetch(`${API_BASE_URL}/profile`, {
              signal: AbortSignal.timeout(5000),
            }),
          3,
          1000
        );
      } catch {
        // Silent fail — main fetch will retry anyway
      }
    };

    preloadBackend();
  }, [API_BASE_URL]);

  // 📡 Load essential data with retry logic
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
        // Allow UI to proceed while flagging server issue
        if (isMounted) {
          setIsServerReady(true);
          setServerError(true);
        }
      }
    };

    // Start loading attempt
    loadEssentialData();

    // ⏳ Timeout: Show error after 90 seconds if still loading
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

  // 🔐 Validate Admin Key
  useEffect(() => {
    let isMounted = true;

    const validateAdminKey = async () => {
      const queryKey = new URLSearchParams(
        window.location.search
      ).get("admin_key");

      // No admin key provided
      if (!queryKey) {
        if (isMounted) setAdminValidated(true);
        return;
      }

      try {
        const url = `${API_BASE_URL}/admin/validate?admin_key=${encodeURIComponent(
          queryKey
        )}`;

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
            setAdminError(
              "Invalid admin key. Access denied. Please check your URL."
            );
            setAdminValidated(true);
          }
        } else {
          console.error("❌ Unexpected response:", response.status);
          if (isMounted) {
            setAdminError(
              `Validation failed (${response.status}). Is the backend running?`
            );
            setAdminValidated(true);
          }
        }
      } catch (error) {
        console.error("🔥 Admin validation error:", error);
        if (isMounted) {
          setAdminError(
            "⚠️ Could not reach backend. Please try again in a moment."
          );
          setAdminValidated(true);
        }
      }
    };

    // Wait for server readiness before validating admin key
    if (isServerReady) {
      validateAdminKey();
    }

    return () => {
      isMounted = false;
    };
  }, [isServerReady, API_BASE_URL]);

  // 🔄 Show loading screen while server is waking up
  if (!isServerReady) {
    return <ServerWarmupLoader isLoading={!isServerReady} />;
  }

  // ⏳ Show validation loader
  if (!adminValidated) {
    return (
      <div className="bg-[#080c14] text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-lg">
            Validating access...
          </div>
          <p className="text-gray-400 text-sm mt-4">
            Check browser console for details
          </p>
        </div>
      </div>
    );
  }

  // ❌ Admin validation error
  if (adminError) {
    return (
      <ErrorPage
        title="Access Denied"
        message={adminError}
        isDev={import.meta.env.DEV}
      />
    );
  }

  // 🌐 Server delay error
  if (serverError && !adminMode) {
    return (
      <ErrorPage
        title="Connecting the servers ..."
        message="Thank you for your patience! Please just wait a moment while we’re preparing for your smooth experience."
        isDev={import.meta.env.DEV}
      />
    );
  }

  // 👨‍💻 Admin Panel
  if (adminMode) {
    return <Admin />;
  }

  // 🌟 Public Portfolio
  return (
    <div className="bg-[#080c14] text-white min-h-screen antialiased">
      <Navbar />
      <Home adminMode={false} />
    </div>
  );
}

export default App;