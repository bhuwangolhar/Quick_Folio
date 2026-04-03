const ADMIN_KEY = process.env.ADMIN_KEY || "quickfolio-admin-secret";

function requireAdminKey(req, res, next) {
  const key = req.query.admin_key || req.headers["x-admin-key"] || "";

  if (key !== ADMIN_KEY) {
    return res.status(401).json({ message: "Admin key required or invalid" });
  }

  next();
}

module.exports = { requireAdminKey, ADMIN_KEY };
