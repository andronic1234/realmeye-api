const cheerio = require("cheerio");
const axios = require("axios");
const express = require("express");

const app = express();
module.exports.CharacterInfo = function CharacterInfo(website, result) {
  try {
    axios(website, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      },
    }).then((res) => {
      const data = res.data;
      const $ = cheerio.load(data);

      let content = [];
      let items = [];
      let characters = [];
      let PlayerInfo = [];
      let CharacterList = [];

      const num = $(".active").find("a").text();
      if (!num) {
        return result.send("Error: Player not found.");
      } else if (num == "Characters (0)") {
        return result.send("Error: Data not found.");
      }
      let filter = true;
      $(".summary tbody tr", data).each(function () {
        $(this)
          .find("td", data)
          .each(function () {
            const value = $(this).text();

            if (filter == true) {
              filter = false;
            } else {
              filter = true;
              PlayerInfo.push(value);
              console.log(value);
            }
          });
      });

      $("#e tbody tr", data).each(function () {
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

            let itemurl = "https://www.realmeye.com" + url;

            items.push({
              title: itemurl.slice(30),
              url: itemurl,
            });
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
      content.push({
        Characters: PlayerInfo[0],
        Skins: PlayerInfo[1],
        Exaltations: PlayerInfo[2],
        Fame: PlayerInfo[3],
        Rank: PlayerInfo[4],
        AccountFame: PlayerInfo[5],
        CharacterList: CharacterList,
      });
      return result.json(content);
    });
  } catch (error) {
    console.log(error);
  }
};
