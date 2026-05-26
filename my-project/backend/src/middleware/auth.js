const requireUser = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Требуется вход в систему" });
  }
  return next();
};

const requireAdmin = (req, res, next) => {
  if (!req.session.isAdmin) {
    return res.status(403).json({ message: "Доступ только для администратора" });
  }
  return next();
};

module.exports = { requireUser, requireAdmin };
