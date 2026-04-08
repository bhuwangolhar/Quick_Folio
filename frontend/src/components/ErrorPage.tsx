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
  return (
    <div className="bg-[#080c14] text-white min-h-screen flex items-center justify-center">
      <div className="text-center max-w-lg p-6">
        <h1 className="text-4xl font-bold mb-4">🚫 {title}</h1>
        <p className="text-xl text-red-400 mb-6">{message}</p>

        {isDev && (
          <div className="bg-gray-800 p-4 rounded mb-6 text-sm text-left">
            <p className="text-gray-300 font-mono text-xs">
              Valid routes:
              <br />• <code>/</code> - Public portfolio
              <br />• <code>/?admin_key=KEY</code> - Admin mode
            </p>
          </div>
        )}

        <button
          onClick={() => (window.location.href = "/")}
          className="px-6 py-2 bg-amber-400 text-black font-bold rounded hover:bg-amber-300 transition"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
