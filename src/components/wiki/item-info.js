const cheerio = require("cheerio");
const axios = require("axios");

module.exports.ItemInfo = function ItemInfo(website, result) {
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

      const Title = $(".row h1", data).text();

      $(".wiki-page .table-responsive", data).each(function () {
        // console.log($(this).text());
      });
      const Info = $(".wiki-page .table-responsive");
      const Description = $(Info).first().text().replace(/\r?\n/g, "");
      const InfoTable = $(Info)
        .children("table")
        .find("tbody tr")
        .map((i, rows) => {
          const row = $(rows).text().replace(/\r?\n/g, " ").trim().split(" ");
          switch (row[0]) {
            case "Tier":
              if (row.length > 2) return;
              return { Tier: row.slice(1).join(" ") };
            case "While":
              if (row[1] === "Key")
                return { WhileKeyHeld: row.slice(3).join(" ") };
              return;
            case "When":
              if (row[1] === "Key")
                return { WhenKeyReleased: row.slice(3).join(" ") };
            case "MP":
              return { MPCost: row.slice(2).join(" ") };
            case "On":
              if (row[1] === "Equip")
                return { OnEquip: row.slice(2).join(" ") };
            case "Throw":
              return { ThrowTime: row.slice(2).join(" ") };
            case "Impact":
              return { ImpactDamage: row.slice(2).join(" ") };
            case "Duration":
              return { Duration: row.slice(1).join(" ") };
            case "Trigger":
              return { TriggerRadius: row.slice(2).join(" ") };
            case "Explosion":
              return { ExplosionRadius: row.slice(2).join(" ") };
            case "Shots":
              return { Shots: row.slice(1).join(" ") };
            case "Damage":
              if (row.slice(1).join(" ") === "") return;
              return { Damage: row.slice(1).join(" ") };
            case "Defense":
              if (row[1] === "Ignored")
                return { DefenseIgnored: row.slice(2).join(" ") };
              return;
            case "Radius":
              return { Radius: row.slice(1).join(" ") };
            case "Heal":
              if (row[1] === "Range")
                return { HealRange: row.slice(2).join(" ") };
              return { Heal: row.slice(1).join(" ") };
            case "Total":
              if (row[1] === "Damage")
                return { TotalDamage: row.slice(2).join(" ") };
            case "Projectile":
              return { ProjectileSpeed: row.slice(2).join(" ") };
            case "Lifetime":
              return { Lifetime: row.slice(1).join(" ") };
            case "Range":
              if (row[1] === "Multiplier")
                return { RangeMultiplier: row.slice(2).join(" ") };
              return { Range: row.slice(1).join(" ") };
            case "Stat":
              if (row[1] === "Multiplier")
                return { StatMultiplier: row.slice(2).join(" ") };
            case "Dash":
              return { DashDistance: row.slice(2).join(" ") };
            case "Trail":
              return { TrailDamage: row.slice(2).join(" ") };
            case "Max":
              if (row[1] === "Cast")
                return { MaxCastRange: row.slice(3).join(" ") };
              if (row[1] === "Dashes")
                return { MaxDashes: row.slice(2).join(" ") };
            case "Targeting":
              return { TargetingCone: row.slice(2).join(" ") };
            case "Targets":
              return { Targets: row.slice(1).join(" ") };
            case "Shockblast":
              if (row[1] === "Targets")
                return { ShockblastTargets: row.slice(2).join(" ") };
              if (row[1] === "Range")
                return { ShockblastRange: row.slice(2).join(" ") };
              if (row[1] === "Triggers")
                return { ShockblastTriggers: row.slice(2).join(" ") };
              return;
            case "Amplitude":
              return { Amplitude: row.slice(1).join(" ") };
            case "Frequency":
              return { Frequency: row.slice(1).join(" ") };
            case "Effect(s)":
              return { Effects: row.slice(1).join(" ").trim() };
            case "Decoy":
              if (row[1] === "Distance")
                return { DecoyDistance: row.slice(2).join(" ") };
              if (row[1] === "Move")
                return { DecoyMoveTime: row.slice(3).join(" ") };
              return;
            case "Summons":
              return { Summons: row.slice(1).join(" ") };
            case "Summon":
              return { SummonLifetime: row.slice(2).join(" ") };
            case "Follow":
              if (row[1] === "Speed")
                return { FollowSpeed: row.slice(2).join(" ") };
              return;
            case "Reactive":
              return { ReactiveProcs: row.slice(2).join(" ") };
            case "Rate":
              return { RateOfFire: row.slice(3)[0] };
            case "Cooldown":
              return { Cooldown: row.slice(1).join(" ") };
            case "XP":
              return { XPBonus: row.slice(2)[0] };
            case "Soulbound":
              return { Soulbound: true };
            case "Feed":
              return { FeedPower: row.slice(2)[0] };
            case "Loot":
              const Bag = $(rows).find("td img").attr("title");
              return { LootBag: Bag };
            default:
              return;
          }
        })
        .get();

      let finalInfo = {};
      for (let i = 0; i < InfoTable.length; i++) {
        Object.assign(finalInfo, InfoTable[i]);
      }

      if (Object.keys(finalInfo).length <= 2)
        return result.status(400).json({
          error:
            "This endpoint only works for item data. Sorry for the incovenience!",
        });

      return result.status(200).json({
        Title: Title,
        Description: Description,
        ...finalInfo,
      });
    })
    .catch(function (err) {
      if (err.response?.status === 429) {
        try {
          return result.status(429).json({ error: "Too many requests" });
        } catch (err) {
          console.log(err);
        }
      }
      if (err.response?.status === 404) {
        return result.status(404).json({ error: "Not Found" });
      }
    });
};
