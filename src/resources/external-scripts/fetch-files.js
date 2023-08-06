const fs = require("fs");
const schedule = require("node-schedule");
const axios = require("axios");
const path = require("path");
const { characterDyeData } = require("./fetch-dyeData");

let ItemImgUrl = "https://www.realmeye.com/s/fq/css/renders.png";
let CharacterImgUrl = "https://www.realmeye.com/s/fj/img/sheets.png";

module.exports.fetchFiles = function fetchFiles() {
  schedule.scheduleJob("0 0 * * *", async (date) => {
    await axios
      .get(ItemImgUrl, {
        responseType: "arraybuffer",
      })
      .then((response) => {
        console.log(date);
        fs.writeFileSync(
          path.join(__dirname, "../renders.png"),
          response.data,
          {
            encoding: "base64",
          }
        );
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
        fs.writeFileSync(path.join(__dirname, "../sheets.png"), response.data, {
          encoding: "base64",
        });
      })
      .catch((ex) => {
        console.error(ex);
      });
    await characterDyeData();
    console.log(date);
  });
};
