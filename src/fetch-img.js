const fs = require("fs");
const schedule = require("node-schedule");
const axios = require("axios");

let imgUrl = "https://www.realmeye.com/s/bb/css/renders.png";

module.exports.FetchImg = function FetchImg() {
  schedule.scheduleJob("0 0 * * *", async (date) => {
    await axios
      .get(imgUrl, {
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
  });
};
