module.exports = function (req, res, next) {
  const userData = req.body;
  
  if (
    !userData?.firstname ||
    !userData?.lastname ||
    !userData?.email ||
    !userData?.phone ||
    !userData?.links.trim()
    ) {
    res.badRequest('Not enough data');
  }
  return next();
};