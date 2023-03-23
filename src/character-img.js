const cheerio = require("cheerio");
const axios = require("axios");
const sharp = require("sharp");
const fs = require("fs");

module.exports.characterImg = async function characterImg(website, char, res) {
  const attributes = [];
  let originalImage = __dirname + "/resources/sheets.png";
  await axios(website, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    },
  }).then(async (res) => {
    const data = res.data;
    const $ = cheerio.load(data);

    $(".table-responsive table tbody", data).each(function () {
      $(this)
        .find("tr", data)
        .each(function () {
          const value = $(this).find("td", data).text();
          if (value.toLowerCase().startsWith(char.toLowerCase())) {
            const style = $(this)
              .find(".character", data)
              .css("background-position");

            var b = style.split(" ").map(function (style) {
              return parseInt(style, 10) * -1;
            });
            attributes.push({ attribs: b });
          }
        });
    });
  });
  if (attributes.length == 0) return res.json({ error: "Not Found" });
  sharp(originalImage)
    .extract({
      left: attributes[0].attribs[0],
      top: attributes[0].attribs[1] -250,
      width: 46,
      height: 46,
    })
    .toBuffer()
    .then((data) => {
      res.end(data);
    })
    .catch(() => res.json({ error: "Not Found" }));
};
