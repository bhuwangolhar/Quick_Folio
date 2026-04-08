import { useState, useEffect } from "react";

interface ServerWarmupLoaderProps {
  isLoading: boolean;
}

export default function ServerWarmupLoader({ isLoading }: ServerWarmupLoaderProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setElapsedSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  let statusMessage = "Waking up server... please wait";
  if (elapsedSeconds > 30) {
    statusMessage = "Almost there...";
  } else if (elapsedSeconds > 10) {
    statusMessage = "Still waking up the server...";
  }

  return (
    <div className="fixed inset-0 bg-[#080c14] bg-opacity-95 flex items-center justify-center z-50">
      <div className="text-center space-y-6 max-w-md px-6">
        {/* Loading spinner */}
        <div className="flex justify-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>

        {/* Main message */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{statusMessage}</h2>
          <p className="text-gray-400 text-sm">
            This may take up to 30–60 seconds on first visit
          </p>
        </div>

        {/* Progress indicator */}
        <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-500 h-full transition-all duration-500"
            style={{
              width: `${Math.min((elapsedSeconds / 60) * 100, 90)}%`,
            }}
          ></div>
        </div>

        {/* Time elapsed */}
        <p className="text-gray-500 text-xs">{elapsedSeconds}s elapsed</p>
      </div>
    </div>
  );
}
