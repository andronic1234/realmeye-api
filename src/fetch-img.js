const fs = require("fs");
const schedule = require("node-schedule");
const axios = require("axios");

let ItemImgUrl = "https://www.realmeye.com/s/bb/css/renders.png";
let CharacterImgUrl = "https://www.realmeye.com/s/fj/img/sheets.png";

module.exports.FetchImg = function FetchImg() {
  schedule.scheduleJob("0 0 * * *", async (date) => {
    await axios
      .get(ItemImgUrl, {
        responseType: "arraybuffer",
      })
      .then((response) => {
        console.log(date);
        fs.writeFileSync(__dirname + "/resources/renders.png", response.data, {
          encoding: "base64",
        });
      })
      .catch((ex) => {
        console.error(ex);
      });

    await axios
      .get(CharacterImgUrl, {
        responseType: "arraybuffer",
      })
      .then((response) => {
        console.log(date);
        fs.writeFileSync(__dirname + "/resources/sheets.png", response.data, {
          encoding: "base64",
        });
      })
      .catch((ex) => {
        console.error(ex);
      });
  });
};
