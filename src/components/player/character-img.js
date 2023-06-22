const cheerio = require("cheerio");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const dyeData = require("../../resources/dyeData");
let GetDyeData = dyeData.dyeData;
let color = [];

module.exports.characterImg = async function characterImg(website, char, res) {
  const attributes = [];
  let originalImage = path.join(__dirname, "../../resources/sheets.png");

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
              const skinPosition = $(this)
                .find(".character", data)
                .css("background-position");
              const skinAccessoryDye = $(this)
                .find(".character", data)
                .attr("data-accessory-dye-id");
              const skinClothingDye = $(this)
                .find(".character", data)
                .attr("data-clothing-dye-id");
              var b = skinPosition.split(" ").map(function (skinPosition) {
                return parseInt(skinPosition, 10) * -1;
              });
              attributes.push({ attribs: b });

              for (let i = 0; i < 2; i++) {
                let data_dye = parseInt(
                  i > 0 ? skinAccessoryDye : skinClothingDye
                );
                let dyeArr = Object.entries(GetDyeData).filter(([key, value]) =>
                  value.includes(data_dye)
                )[0];

                const key = +dyeArr[0];
                const value = dyeArr[1];

                if (value.slice(0, 3).join("") === "000") {
                  if (data_dye == 0) return;
                  color.push("#" + ("00000" + key.toString(16)).slice(-6));
                } else {
                  color.push(value);
                }
              }
            }
          });
      });
    })
    .catch(function (err) {
      if (err.response.status === 429) {
        return res.status(429).json({ error: "Too many requests" });
      }
    });
  if (attributes.length == 0)
    return res.status(404).json({ error: "Not Found" });
  const canvas = {
    outputCanvas: createCanvas(50, 50),
    skinCanvas: createCanvas(50, 50),
    dye1Canvas: createCanvas(50, 50),
    dye2Canvas: createCanvas(50, 50),
    markDye1Canvas: createCanvas(50, 50),
    markDye2Canvas: createCanvas(50, 50),
  };
  const contexts = {
    output: canvas.outputCanvas.getContext("2d"),
    skin: canvas.skinCanvas.getContext("2d"),
    dye1: canvas.dye1Canvas.getContext("2d"),
    dye2: canvas.dye2Canvas.getContext("2d"),
    markDye1: canvas.markDye1Canvas.getContext("2d"),
    markDye2: canvas.markDye2Canvas.getContext("2d"),
  };
  try {
    loadImage(originalImage).then((image) => {
      contexts.skin.drawImage(
        image,
        attributes[0].attribs[0],
        attributes[0].attribs[1] - 250,
        50,
        50,
        0,
        0,
        50,
        50
      );
      let dark = -50;
      contexts.output.drawImage(canvas.skinCanvas, 0, 0);
      if (typeof color[0] !== "undefined") {
        if (typeof color[0] === "string") {
          if (color[0] !== "#000000") {
            dark = 0;
          }
          drawCloth(contexts.dye1, color[0]);
        }
        contexts.dye1.drawImage(
          image,
          attributes[0].attribs[0],
          attributes[0].attribs[1] - 200 - dark,
          50,
          50,
          0,
          0,
          50,
          50
        );
        if (typeof color[0] === "object") {
          drawCloth(contexts.markDye1, color[0], image);
          contexts.dye1.globalCompositeOperation = "source-in";
          contexts.dye1.drawImage(canvas.markDye1Canvas, 0, 0);
        }
        contexts.output.drawImage(canvas.dye1Canvas, 0, 0);
      }
      if (typeof color[1] !== "undefined") {
        if (typeof color[1] === "string") {
          if (color[1] !== "#000000") {
            dark = 0;
          }
          drawCloth(contexts.dye2, color[1]);
        }
        contexts.dye2.drawImage(
          image,
          attributes[0].attribs[0],
          attributes[0].attribs[1] - 100 - dark,
          50,
          50,
          0,
          0,
          50,
          50
        );
        if (typeof color[1] === "object") {
          drawCloth(contexts.markDye2, color[1], image);
          contexts.dye2.globalCompositeOperation = "source-in";
          contexts.dye2.drawImage(canvas.markDye2Canvas, 0, 0);
        }
        contexts.output.drawImage(canvas.dye2Canvas, 0, 0);
      }
      const buffer = canvas.outputCanvas.toBuffer("image/png");
      res.status(200).end(buffer);
      color = [];
      return;
    });
  } catch (err) {
    res.status(404).json({ error: "Could not get image" });
    console.log(err);
    return;
  }

  function drawCloth(context, palette, image) {
    if (typeof palette === "object") {
      for (let col = 0; col < 11; col++) {
        for (let row = 0; row < 11; row++) {
          context.drawImage(
            image,
            palette[2],
            image.height - 48,
            palette[0],
            palette[1],
            row * palette[0] - 4,
            col * palette[1] - 4,
            palette[0],
            palette[1]
          );
        }
      }
    } else {
      context.fillStyle = palette;
      context.fillRect(0, 0, 50, 50);
      context.globalCompositeOperation = "destination-in";
    }
  }
};
