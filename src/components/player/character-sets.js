const cheerio = require("cheerio");
const axios = require("axios");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");
let originalImage = path.join(__dirname, "../../resources/renders.png");

let Coords = [];
let CharCoords = {};
let content = [];
let ImageArray = [];

module.exports.characterSets = async function characterSets(website, result) {
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
            let value = $(this).find("td", data).eq(1).text();
            if (value === "") value = $(this).find("td", data).eq(2).text();
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
            CharCoords = {
              [value]: Coords,
            };
            content = { ...content, ...CharCoords };
            Coords = [];
          });
        CharCoords = {};
      });
    })
    .catch(function (err) {
      if (err.response.status === 429) {
        return result.status(429).json({ error: "Too many requests" });
      }
    });
  if (content.length == 0) return;

  try {
    loadImage(originalImage).then((image) => {
      Object.keys(content).forEach((key) => {
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

        contexts.weapon.drawImage(
          image,
          content[key][0]?.Coordinates[0],
          content[key][0]?.Coordinates[1],
          dimensions.width,
          dimensions.height,
          0,
          0,
          dimensions.width,
          dimensions.height
        );
        contexts.ability.drawImage(
          image,
          content[key][1]?.Coordinates[0],
          content[key][1]?.Coordinates[1],
          dimensions.width,
          dimensions.height,
          0,
          0,
          dimensions.width,
          dimensions.height
        );
        contexts.armor.drawImage(
          image,
          content[key][2]?.Coordinates[0],
          content[key][2]?.Coordinates[1],
          dimensions.width,
          dimensions.height,
          0,
          0,
          dimensions.width,
          dimensions.height
        );
        contexts.ring.drawImage(
          image,
          content[key][3]?.Coordinates[0],
          content[key][3]?.Coordinates[1],
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
        ImageArray = { ...ImageArray, [key]: buffer };

        contexts.weapon.clearRect(0, 0, canvas.width, canvas.height);
        contexts.ability.clearRect(0, 0, canvas.width, canvas.height);
        contexts.armor.clearRect(0, 0, canvas.width, canvas.height);
        contexts.ring.clearRect(0, 0, canvas.width, canvas.height);
        contexts.set.clearRect(0, 0, canvas.width, canvas.height);
      });
      content = [];
      return result.status(200).json(ImageArray);
    });
    ImageArray = [];
  } catch {
    return result.status(404).json({ error: "Not Found" });
  }
};
