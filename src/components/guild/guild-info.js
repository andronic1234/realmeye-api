const cheerio = require("cheerio");
const axios = require("axios");

module.exports.GuildInfo = function GuildInfo(website, result) {
  axios(website, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    },
  })
    .then((res) => {
      const data = res.data;
      const $ = cheerio.load(data);

      let content = [];
      let members = [];
      let guildInfo = [];
      let membercache = [];

      let guild = $(".entity-name", data).text();
      if (!guild) {
        return result.status(404).json({ error: "Not Found" });
      }
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
      });
      $(".table-responsive table tbody tr", data).each(function () {
        $(this)
          .find("td", data)
          .each(function () {
            const value = $(this).text();
            if (value !== "") {
              membercache.push(value);
            }
          });

        members.push({
          name: membercache[0],
          guild_rank: membercache[1],
          fame: membercache[2],
          star_rank: membercache[3],
          characters: membercache[4],
        });
        membercache = [];
      });

      content.push({
        Guild: guild,
        Members: guildInfo[0],
        Characters: guildInfo[1],
        Fame: guildInfo[2],
        MostActiveOn: guildInfo[3],
        GuildMemberData: members,
      });
      return result.status(200).json(content);
    })
    .catch(function (err) {
      if (err.response.status === 429) {
        try {
          return result.status(429).json({ error: "Too many requests" });
        } catch (err) {
          console.log(err);
        }
      }
    });
};
