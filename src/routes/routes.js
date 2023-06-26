const express = require("express");
const router = express.Router();
const { PlayerInfo } = require("../components/player/player-info");
const { GuildInfo } = require("../components/guild/guild-info");
const { itemImg } = require("../components/player/item-img");
const { characterImg } = require("../components/player/character-img");
const { ItemInfo } = require("../components/wiki/item-info");

router.get("/", (req, res) => {
  res.send("Welcome to my RealmEye API");
});
router.get(`/player/:name`, (req, res) => {
  const player = req.params.name;
  const website = `https://www.realmeye.com/player/${player}`;
  let result = res;
  PlayerInfo(website, result);
});
router.get(`/player/:name/:char`, async (req, res) => {
  const player = req.params.name;
  const char = req.params.char;
  const website = `https://www.realmeye.com/player/${player}`;
  await characterImg(website, char, res);
});
router.get(`/player/:name/:char/:item`, async (req, res) => {
  const player = req.params.name;
  const char = req.params.char;
  const item = req.params.item;
  const website = `https://www.realmeye.com/player/${player}`;
  coords = [];
  await itemImg(coords, website, char, res, item);
});

router.get(`/guild/:guild`, (req, res) => {
  const guild = req.params.guild;
  const website = `https://www.realmeye.com/guild/${guild}`;
  let result = res;
  GuildInfo(website, result);
});

router.get(`/wiki/:search`, async (req, res) => {
  const search = req.params.search;
  const website = `https://www.realmeye.com/wiki/${search}`;
  ItemInfo(website, res);
});

module.exports = router;
