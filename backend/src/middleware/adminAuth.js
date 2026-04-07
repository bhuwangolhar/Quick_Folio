// Admin key must be set via environment variable in production
const ADMIN_KEY = process.env.ADMIN_KEY;

if (!ADMIN_KEY && process.env.NODE_ENV === "production") {
  console.error("FATAL: ADMIN_KEY environment variable must be set in production");
  process.exit(1);
}

// Fallback for development only
const effectiveAdminKey = ADMIN_KEY || "dev-admin-key-change-me";

function requireAdminKey(req, res, next) {
  const key = req.query.admin_key || req.headers["x-admin-key"] || "";

  if (key !== effectiveAdminKey) {
    return res.status(401).json({ message: "Admin key required or invalid" });
  }

  next();
}

module.exports = { requireAdminKey, ADMIN_KEY: effectiveAdminKey };
