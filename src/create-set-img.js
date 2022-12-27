const cheerio = require("cheerio");
const axios = require("axios");
const sharp = require("sharp");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// creates image sets
let originalImage = "./src/resources/In/renders.png";

module.exports.createSetImg = async function createSetImg(
  Coords,
  website,
  char,
  res,
  item
) {
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
            $(this)
              .find(".item-wrapper", data)
              .each(function () {
                let item = $(this)
                  .find(".item")
                  .attr("style")
                  .replace(/\D/g, " ")
                  .replace(/  +/g, " ")
                  .slice(1, -1);
                var b = item.split(" ").map(function (item) {
                  return parseInt(item, 10);
                });
                Coords.push({
                  Coordinates: b,
                });
              });
          }
        });
    });
  });

  if(Coords.length == 0) return res.json({ error: "Not Found" })

  try {
    sharp(originalImage)
      .extract({
        left: Coords[0].Coordinates[0],
        top: Coords[0].Coordinates[1],
        width: 46,
        height: 46,
      })
      .toFile("./src/resources/Items/weapon.png", function (err) {
        if (err) return console.log(err);
      });
    sharp(originalImage)
      .extract({
        left: Coords[1].Coordinates[0],
        top: Coords[1].Coordinates[1],
        width: 46,
        height: 46,
      })
      .toFile("./src/resources/Items/ability.png", function (err) {
        if (err) return console.log(err);
      });
    sharp(originalImage)
      .extract({
        left: Coords[2].Coordinates[0],
        top: Coords[2].Coordinates[1],
        width: 46,
        height: 46,
      })
      .toFile("./src/resources/Items/armor.png", function (err) {
        if (err) return console.log(err);
      });
    sharp(originalImage)
      .extract({
        left: Coords[3].Coordinates[0],
        top: Coords[3].Coordinates[1],
        width: 46,
        height: 46,
      })
      .toFile("./src/resources/Items/ring.png", function (err) {
        if (err) return console.log(err);
      });

    await delay(500);
    
  } catch (err) {
    console.log(err);
  }
  try{
  return res.sendFile(__dirname + `/resources/Items/${item}.png`);
  } catch {
    res.json({ error: "Not Found" })
  }
};
