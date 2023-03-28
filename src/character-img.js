const cheerio = require("cheerio");
const axios = require("axios");
const sharp = require("sharp");
const fs = require("fs");
let dyeData = require("./dyeData");
let GetDyeData = dyeData.dyeData;

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
            const skinPosition = $(this)
              .find(".character", data)
              .css("background-position");
            const skinAccessoryDye = $(this)
              .find(".character", data)
              .attr("data-accessory-dye-id");
            const skinClothingDye = $(this)
              .find(".character", data)
              .attr("data-clothing-dye-id");

            console.log(skinAccessoryDye);
            let dyeArr = Object.entries(GetDyeData).filter(([key, value]) =>
              value.includes(skinClothingDye)
            )[0];
            console.log(dyeArr);

            // const skinAccessoryDyeHex =
            // "#" + ("00000" + skinAccessoryDyes.toString(16)).slice(-6); //if dye
            // console.log(skinAccessoryDyeHex);
            // console.log(skinAccessoryDye);

            var b = skinPosition.split(" ").map(function (skinPosition) {
              return parseInt(skinPosition, 10) * -1;
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
      top: attributes[0].attribs[1] - 250,
      width: 50,
      height: 50,
    })
    .toBuffer()
    .then((data) => {
      res.end(data);
    })
    .catch(() => res.json({ error: "Not Found" }));
};
