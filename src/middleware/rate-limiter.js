const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 5000,
  max: 8,
  delayMs: 0,
  headers: true,
  handler: function (req, res) {
    return res.status(429).json({
      error: "Too many requests, please try again later.",
    });
  },
  keyGenerator: (req, res) => {
    console.log(req.clientIp);
    return req.clientIp;
  },
});

module.exports = limiter;