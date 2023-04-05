const cheerio = require("cheerio");
const axios = require("axios");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

// creates image sets
let originalImage = path.join(__dirname, "../../resources/renders.png");

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
  })
    .then(async (res) => {
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
    })
    .catch(function (err) {
      if (err.response.status === 429) {
        return res.status(429).json({ error: "Too many requests" });
      }
    });

  if (Coords.length == 0) return res.status(404).json({ error: "Not Found" });

  try {
    const canvas = createCanvas(46, 46);
    const context = canvas.getContext("2d");
    switch (item.toLowerCase()) {
      case "weapon":
        try {
          loadImage(originalImage).then((image) => {
            context.drawImage(
              image,
              Coords[0].Coordinates[0],
              Coords[0].Coordinates[1],
              46,
              46,
              0,
              0,
              46,
              46
            );
            const buffer = canvas.toBuffer("image/png");
            res.status(200).end(buffer);
          });
        } catch {
          res.status(404).json({ error: "Not Found" });
        }
        break;
      case "ability":
        try {
          loadImage(originalImage).then((image) => {
            context.drawImage(
              image,
              Coords[1].Coordinates[0],
              Coords[1].Coordinates[1],
              46,
              46,
              0,
              0,
              46,
              46
            );
            const buffer = canvas.toBuffer("image/png");
            res.status(200).end(buffer);
          });
        } catch {
          res.status(404).json({ error: "Not Found" });
        }
        break;
      case "armor":
      case "armour":
        try {
          loadImage(originalImage).then((image) => {
            context.drawImage(
              image,
              Coords[2].Coordinates[0],
              Coords[2].Coordinates[1],
              46,
              46,
              0,
              0,
              46,
              46
            );
            const buffer = canvas.toBuffer("image/png");
            res.status(200).end(buffer);
          });
        } catch {
          res.status(404).json({ error: "Not Found" });
        }
        break;
      case "ring":
        try {
          loadImage(originalImage).then((image) => {
            context.drawImage(
              image,
              Coords[3].Coordinates[0],
              Coords[3].Coordinates[1],
              46,
              46,
              0,
              0,
              46,
              46
            );
            const buffer = canvas.toBuffer("image/png");
            res.status(200).end(buffer);
          });
        } catch {
          res.status(404).json({ error: "Not Found" });
        }
        break;
      default:
        res.status(404).json({ error: "Not Found" });
        break;
    }
  } catch (err) {
    console.log(err);
  }
};
