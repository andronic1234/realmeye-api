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

      let content = []
      let items = [];
      let characters = [];

      const num = $(".active").find("a").text();
      if (!num) {
        return result.send('Error: Player not found.')
      } else if (num == 'Characters (0)') {
        return result.send('Error: Data not found.')
      }
      content.push({ amount: num });
      $("#e tbody tr", data).each(function () {
        $(this)
          .find("td", data)
          .each(function () {
            const value = $(this).text();
            if(value != '') {
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
        content.push({
          character: characters[0],
          level: characters[1],
          fame: characters[2],
          pos: characters[3],
          items: items,
        });
        items = [];
        characters = [];
    }); 
        return result.json(content)
        

});
  } catch (error) {
    console.log(error, error.message);
  }
};
