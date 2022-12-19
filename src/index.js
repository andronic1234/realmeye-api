const fs = require("fs/promises");
const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");
const app = express();

const PORT = process.env.PORT || 3000;
const player = "/player/-PlayerName-";
const website = `https://www.realmeye.com${player}`;
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

    const num = $(".active").find("a").text();
    content.push({ amount: num });
    $("#e tbody tr", data).each(function (i, element) {
      $(this)
        .find("td", data)
        .each(function () {
          const value = $(this).text();
          characters.push(value);
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
      let fame = characters[4];
      let pos = characters[5];
      content.push({
        character: characters[2],
        level: characters[3],
        fame: fame,
        pos: pos,
        items: items,
      });
      items = [];
      characters = [];
      app.get(`/`, (req, res) => {
        res.json(content);
      });
    });
  });
} catch (error) {
  console.log(error, error.message);
}

app.listen(PORT, () => {
  console.log(`server is running on PORT:${PORT}`);
});
