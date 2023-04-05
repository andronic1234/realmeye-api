const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 5000,
  max: 4,
  handler: function (req, res) {
    return res.status(429).json({
      error: "Too many requests, please try again later.",
    });
  },
});

module.exports = limiter;
