const cheerio = require("cheerio");
const axios = require("axios");

module.exports.PlayerInfo = function PlayerInfo(website, result) {
  axios(website, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    },
  })
    .then((res) => {
      const data = res.data;
      const $ = cheerio.load(data);

      let content = [];
      let items = [];
      let characters = [];
      let PlayerInfo = [];
      let CharacterList = [];

      const num = $(".active").find("a").text();
      let PlayerName = $(".entity-name", data).text();
      if (PlayerName == "") return result.json({ error: "Not Found" });
      let filter = true;
      $(".summary tbody tr", data).each(function () {
        $(this)
          .find("td", data)
          .each(function () {
            const value = $(this).text();
            PlayerInfo.push(value);
          });
      });

      $(".table-responsive table tbody tr", data).each(function () {
        $(this)
          .find("td", data)
          .each(function () {
            const value = $(this).text();
            if (value != "") {
              characters.push(value);
            }
          });

        $(this)
          .find(".item-wrapper", data)
          .each(function () {
            let url = $(this).find("a").attr("href");
            let item = $(this).find(".item").attr("title");

            if (url == undefined) {
              items.push({
                title: "No Item",
              });
            } else {
              let itemurl = "https://www.realmeye.com" + url;

              items.push({
                title: item,
                url: itemurl,
              });
            }
          });
        CharacterList.push({
          character: characters[0],
          level: characters[1],
          fame: characters[2],
          pos: characters[3],
          items: items,
        });
        items = [];
        characters = [];
      });
      content = { ...content, PlayerName: PlayerName };
      for (let i = 0; i < PlayerInfo.length; i++) {
        let infoType = PlayerInfo[i];
        let obj;
        switch (infoType) {
          case "Characters":
            obj = {
              Characters: PlayerInfo[i + 1],
            };
            content = { ...content, ...obj };
            break;
          case "Skins":
            obj = {
              Skins: PlayerInfo[i + 1],
            };
            content = { ...content, ...obj };
            break;
          case "Exaltations":
            obj = {
              Exaltations: PlayerInfo[i + 1],
            };
            content = { ...content, ...obj };
            break;
          case "Fame":
            obj = {
              Fame: PlayerInfo[i + 1],
            };
            content = { ...content, ...obj };
            break;
          case "Rank":
            obj = {
              Rank: PlayerInfo[i + 1],
            };
            content = { ...content, ...obj };
            break;
          case "Account fame":
            obj = {
              AccountFame: PlayerInfo[i + 1],
            };
            content = { ...content, ...obj };
            break;
          case "Guild":
            obj = {
              Guild: PlayerInfo[i + 1],
            };
            content = { ...content, ...obj };
            break;
          case "Guild Rank":
            obj = {
              GuildRank: PlayerInfo[i + 1],
            };
            content = { ...content, ...obj };
            break;
          case "Created":
            obj = {
              Created: PlayerInfo[i + 1],
            };
            content = { ...content, ...obj };
            break;
          case "First seen":
            obj = {
              FirstSeen: PlayerInfo[i + 1],
            };
            content = { ...content, ...obj };
            break;
          case "Last seen":
            obj = {
              LastSeen: PlayerInfo[i + 1],
            };
            content = { ...content, ...obj };
            break;
          default:
            break;
        }
      }
      let contentCache = { ...content };
      content = {
        ProfileInfo: contentCache,
        CharacterInfo: CharacterList,
      };
      contentCache = {};
      return result.status(200).json(content);
    })
    .catch(function (err) {
      if (err.response.status === 429) {
        return result.status(429).json({ error: "Too many requests" });
      }
    });
};
