const express = require("express");
const { CharacterInfo, returnContent } = require('./character-info')

const app = express();

const PORT = process.env.PORT || 3000;
app.get(`/player/:name`, (req, res) => {
  const player = req.params.name;
  const website = `https://www.realmeye.com/player/${player}`;
  let result = res
CharacterInfo(website, result)
});


app.listen(PORT, () => {
  console.log(`server is running on PORT:${PORT}`);
});
