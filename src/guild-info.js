const cheerio = require("cheerio");
const axios = require("axios");
const express = require("express");

const app = express();
module.exports.GuildInfo = function GuildInfo(website, result) {
  try {
    axios(website, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      },
    }).then((res) => {
      const data = res.data;
      const $ = cheerio.load(data);

      let content = [];
      let members = [];
      let guildInfo = []
      membercache = [];

      let guild = $(".entity-name", data).text();
      if (!guild) {
        return result.send('Error: Guild not Found.')
      }
      content.push({ guild: guild });
      let filter = true;
      $(".summary tbody tr", data).each(function () {
        $(this)
          .find("td", data)
          .each(function () {
            const value = $(this).text();

            if (filter == true) {
              filter = false;
            } else {
              filter = true;
              guildInfo.push(value);
            }
          });

        $('#e tbody tr', data)
          .each(function () {
            $(this)
              .find("td", data)
              .each(function () {
                const value = $(this).text()
                if(value != ''){
                membercache.push(value)
                }
              });
              
            members.push({
              name: membercache[0],
              guild_rank: membercache[1],
              fame: membercache[2],
              star_rank: membercache[3],
              characters: membercache[4]
            });
            membercache = []
          });
      });
      content.push({
        Members: guildInfo[0],
        Characters: guildInfo[1],
        Fame: guildInfo[2],
        MostActiveOn: guildInfo[3],
        GuildMemberData: members,
      });
      return result.json(content);
    });
  } catch (error) {
    console.log(error, error.message);
  }
};
