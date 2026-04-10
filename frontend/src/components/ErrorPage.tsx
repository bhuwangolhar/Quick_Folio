interface ErrorPageProps {
  title?: string;
  message?: string;
  isDev?: boolean;
}

export default function ErrorPage({
  title = "Access Denied",
  message = "Invalid route or unauthorized access",
  isDev = false,
}: ErrorPageProps) {
  const handleRefresh = () => {
    window.location.href = "/";
  };

  return (
    <div className="bg-[#080c14] text-white min-h-screen flex items-center justify-center">
      <div className="text-center max-w-lg p-6">
        
        {/* Title */}
        <h1 className="text-3xl font-bold mb-4">{title}</h1>

        {/* Message */}
        <p className="text-xl text-white mb-6">{message}</p>

        {/* Developer Mode Info */}
        {isDev && (
          <div className="bg-gray-800 p-4 rounded mb-6 text-sm text-left">
            <p className="text-gray-300 font-mono text-xs">
              Valid routes:
              <br />• <code>/</code> - Public portfolio
              <br />• <code>/?admin_key=KEY</code> - Admin mode
            </p>
          </div>
        )}

        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          className="px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
        >
          Reload
        </button>
      </div>
    </div>
  );
}