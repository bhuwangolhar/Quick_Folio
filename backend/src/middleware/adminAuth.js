// Admin key from environment or fallback
const ADMIN_KEY = process.env.ADMIN_KEY || process.env.ADMIN_SECRET;
const effectiveAdminKey = ADMIN_KEY || "dev-admin-key-change-me";

// Warn in production if using default key
if (process.env.NODE_ENV === "production" && !ADMIN_KEY) {
  console.warn("⚠️  WARNING: Using default admin key in production - set ADMIN_KEY environment variable");
}

function requireAdminKey(req, res, next) {
  const key = req.query.admin_key || req.headers["x-admin-key"] || "";
  
  // Log in development
  if (process.env.NODE_ENV !== "production") {
    console.log("🔐 Admin auth check:");
    console.log("   Received key (first 10 chars):", key.substring(0, 10) + "***");
    console.log("   Expected key (first 10 chars):", effectiveAdminKey.substring(0, 10) + "***");
    console.log("   Match:", key === effectiveAdminKey);
  }

  if (key !== effectiveAdminKey) {
    console.warn("⚠️ Failed admin key attempt");
    return res.status(401).json({ message: "Admin key required or invalid" });
  }

  console.log("✅ Admin key validated successfully");
  next();
}

module.exports = { requireAdminKey, ADMIN_KEY: effectiveAdminKey };
