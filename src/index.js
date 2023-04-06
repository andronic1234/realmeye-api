const express = require("express");
const cors = require("cors");
const requestIp = require("request-ip");
const routes = require("./routes/routes");
const limiter = require("./middleware/rate-limiter");
const { fetchFiles } = require("./middleware/fetch-files");
const app = express();
app.use(requestIp.mw());
app.use(limiter);
app.use(
  cors({
    origin: "*",
  })
);
app.use(routes);

const PORT = process.env.PORT || 3000;

fetchFiles();

app.listen(PORT, () => {
  console.log(`server is running on PORT:${PORT}`);
});
