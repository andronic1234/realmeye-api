const cheerio = require("cheerio");
const axios = require("axios");
const sheetOffsets = "https://www.realmeye.com/s/fj/js/sheet.js";

module.exports.characterDyeData = async function characterDyeData() {
  let dataFound = [];
  await axios(sheetOffsets, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    },
  }).then(async (res) => {
    const data = res.data;
    const $ = cheerio.load(data);
    dataFound.push(
      data.slice(data.indexOf("sheetOffsets")) + "exports.dyeData = dyeData"
    );
  });
  // console.log(dataFound);
  return dataFound;
};
