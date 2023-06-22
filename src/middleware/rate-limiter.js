const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 7000,
  max: 90,
  delayMs: 0,
  headers: true,
  handler: function (req, res) {
    return res.status(429).json({
      error: "Too many requests, please try again later.",
    });
  },
  keyGenerator: (req, res) => {
    return req.clientIp;
  },
});

module.exports = limiter;
