const express = require("express");
const { PlayerInfo } = require("./player-info");
const { GuildInfo } = require("./guild-info");
const app = express();
const router = express.Router();
app.use(router);

const PORT = process.env.PORT || 3000;

router.get(`/player/:name`, function (req, res) {
  const player = req.params.name;
  const website = `https://www.realmeye.com/player/${player}`;
  let result = res;
  PlayerInfo(website, result);
});

router.get(`/guild/:guild`, function (req, res) {
  const guild = req.params.guild;
  const website = `https://www.realmeye.com/guild/${guild}`;
  let result = res;
  GuildInfo(website, result);
});

app.listen(PORT, () => {
  console.log(`server is running on PORT:${PORT}`);
});
