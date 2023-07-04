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
  result,
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
      if (Coords.length == 0) {
        return result.status(404).json({ error: "Not Found" });
      }
    })
    .catch(function (err) {
      if (err.response.status === 429) {
        return result.status(429).json({ error: "Too many requests" });
      }
    });

  if (Coords.length == 0) return;

  try {
    const dimensions = {
      width: 46,
      height: 46,
    };
    const canvas = {
      weaponCanvas: createCanvas(dimensions.width, dimensions.height),
      abilityCanvas: createCanvas(dimensions.width, dimensions.height),
      armorCanvas: createCanvas(dimensions.width, dimensions.height),
      ringCanvas: createCanvas(dimensions.width, dimensions.height),
      setCanvas: createCanvas(dimensions.width * 4, dimensions.height),
    };
    const contexts = {
      weapon: canvas.weaponCanvas.getContext("2d"),
      ability: canvas.abilityCanvas.getContext("2d"),
      armor: canvas.armorCanvas.getContext("2d"),
      ring: canvas.ringCanvas.getContext("2d"),
      set: canvas.setCanvas.getContext("2d"),
    };

    switch (item.toLowerCase()) {
      case "weapon":
        try {
          loadImage(originalImage).then((image) => {
            contexts.weapon.drawImage(
              image,
              Coords[0]?.Coordinates[0],
              Coords[0]?.Coordinates[1],
              dimensions.width,
              dimensions.height,
              0,
              0,
              dimensions.width,
              dimensions.height
            );
            const buffer = canvas.weaponCanvas.toBuffer("image/png");
            return result.status(200).end(buffer);
          });
        } catch {
          return result.status(404).json({ error: "Not Found" });
        }
        break;
      case "ability":
        try {
          loadImage(originalImage).then((image) => {
            contexts.ability.drawImage(
              image,
              Coords[1]?.Coordinates[0],
              Coords[1]?.Coordinates[1],
              dimensions.width,
              dimensions.height,
              0,
              0,
              dimensions.width,
              dimensions.height
            );
            const buffer = canvas.abilityCanvas.toBuffer("image/png");
            return result.status(200).end(buffer);
          });
        } catch {
          return result.status(404).json({ error: "Not Found" });
        }
        break;
      case "armor":
      case "armour":
        try {
          loadImage(originalImage).then((image) => {
            contexts.armor.drawImage(
              image,
              Coords[2]?.Coordinates[0],
              Coords[2]?.Coordinates[1],
              dimensions.width,
              dimensions.height,
              0,
              0,
              dimensions.width,
              dimensions.height
            );
            const buffer = canvas.armorCanvas.toBuffer("image/png");
            return result.status(200).end(buffer);
          });
        } catch {
          return result.status(404).json({ error: "Not Found" });
        }
        break;
      case "ring":
        try {
          loadImage(originalImage).then((image) => {
            contexts.ring.drawImage(
              image,
              Coords[3]?.Coordinates[0],
              Coords[3]?.Coordinates[1],
              dimensions.width,
              dimensions.height,
              0,
              0,
              dimensions.width,
              dimensions.height
            );
            const buffer = canvas.ringCanvas.toBuffer("image/png");
            return result.status(200).end(buffer);
          });
        } catch {
          return result.status(404).json({ error: "Not Found" });
        }
        break;
      case "set":
      case "all":
        try {
          loadImage(originalImage).then((image) => {
            contexts.weapon.drawImage(
              image,
              Coords[0]?.Coordinates[0],
              Coords[0]?.Coordinates[1],
              dimensions.width,
              dimensions.height,
              0,
              0,
              dimensions.width,
              dimensions.height
            );
            contexts.ability.drawImage(
              image,
              Coords[1]?.Coordinates[0],
              Coords[1]?.Coordinates[1],
              dimensions.width,
              dimensions.height,
              0,
              0,
              dimensions.width,
              dimensions.height
            );
            contexts.armor.drawImage(
              image,
              Coords[2]?.Coordinates[0],
              Coords[2]?.Coordinates[1],
              dimensions.width,
              dimensions.height,
              0,
              0,
              dimensions.width,
              dimensions.height
            );
            contexts.ring.drawImage(
              image,
              Coords[3]?.Coordinates[0],
              Coords[3]?.Coordinates[1],
              dimensions.width,
              dimensions.height,
              0,
              0,
              dimensions.width,
              dimensions.height
            );
            contexts.set.drawImage(canvas.weaponCanvas, 0, 0);
            contexts.set.drawImage(canvas.abilityCanvas, 46, 0);
            contexts.set.drawImage(canvas.armorCanvas, 92, 0);
            contexts.set.drawImage(canvas.ringCanvas, 138, 0);

            const buffer = canvas.setCanvas.toBuffer("image/png");
            return result.status(200).end(buffer);
          });
        } catch {
          return result.status(404).json({ error: "Not Found" });
        }
        break;
      default:
        return result.status(404).json({ error: "Not Found" });
    }
  } catch (err) {
    console.log(err);
  }
};
