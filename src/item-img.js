const cheerio = require("cheerio");
const axios = require("axios");
const sharp = require("sharp");

// creates image sets
let originalImage = __dirname + "/resources/renders.png";

module.exports.itemImg = async function itemImg(
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
                let empty = $(this).find(".item").attr("title");
                if (empty == "Empty slot") {
                  Coords.push({
                    Coordinates: [0, 0],
                  });
                } else {
                  let item = $(this).find(".item").css("background-position");
                  var b = item.split(" ").map(function (item) {
                    return parseInt(item, 10) * -1;
                  });
                  Coords.push({
                    Coordinates: b,
                  });
                }
              });
          }
        });
    });
  });

  if (Coords.length == 0) return res.json({ error: "Not Found" });

  try {
    switch (item.toLowerCase()) {
      case "weapon":
        sharp(originalImage)
          .extract({
            left: Coords[0].Coordinates[0],
            top: Coords[0].Coordinates[1],
            width: 46,
            height: 46,
          })
          .toBuffer()
          .then((data) => {
            res.end(data);
          })
          .catch(() => res.json({ error: "Not Found" }));
        break;
      case "ability":
        sharp(originalImage)
          .extract({
            left: Coords[1].Coordinates[0],
            top: Coords[1].Coordinates[1],
            width: 46,
            height: 46,
          })
          .toBuffer()
          .then((data) => {
            res.end(data);
          })
          .catch(() => res.json({ error: "Not Found" }));
        break;
      case "armor":
      case "armour":
        sharp(originalImage)
          .extract({
            left: Coords[2].Coordinates[0],
            top: Coords[2].Coordinates[1],
            width: 46,
            height: 46,
          })
          .toBuffer()
          .then((data) => {
            res.end(data);
          })
          .catch((err) => res.json({ error: "Not Found" }));
        break;
      case "ring":
        sharp(originalImage)
          .extract({
            left: Coords[3].Coordinates[0],
            top: Coords[3].Coordinates[1],
            width: 46,
            height: 46,
          })
          .toBuffer()
          .then((data) => {
            res.end(data);
          })
          .catch(() => res.json({ error: "Not Found" }));
        break;
      default:
        res.json({ error: "Not Found" });
        break;
    }
  } catch (err) {
    console.log(err);
  }
};
