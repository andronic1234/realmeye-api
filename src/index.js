const express = require("express");
const { PlayerInfo } = require("./player-info");
const { GuildInfo } = require("./guild-info");
const { createSetImg } = require("./create-set-img");
const app = express();
const router = express.Router();
let coords = [];
app.use(router);

const PORT = process.env.PORT || 3000;

router.get(`/player/:name`, function (req, res) {
  const player = req.params.name;
  const website = `https://www.realmeye.com/player/${player}`;
  let result = res;
  PlayerInfo(website, result, coords);
});
router.get(`/player/:name/:char/:item`, async function (req, res) {
  const player = req.params.name;
  const char = req.params.char;
  const item = req.params.item.toLowerCase();
  const website = `https://www.realmeye.com/player/${player}`;
  coords = [];
  await createSetImg(coords, website, char, res, item);
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
