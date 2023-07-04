# RealmEye API

#### A Web Scraper that takes data from the website: https://www.realmeye.com/

<br>

#### _API hosted on https://realmeye-api.glitch.me/_

<br><br>

## <b>Usage:</b>

<br>

#### You can get info from guilds using the following parameters:

https://realmeye-api.glitch.me/guild/<b>[Guild_Name]</b>\*

##### \*The guild name is case sensitive.

<br>

#### You can get info from players using the following parameters:

https://realmeye-api.glitch.me/player/<b>[Player_Name]</b>

<br>

#### You can get info from items on the wiki using the following parameters:

https://realmeye-api.glitch.me/wiki/<b>[Item_Name]</b>\*

##### \*It is typed the same way realmeye's links are typed.

<br>

#### You can get character skin images using the following parameters:

https://realmeye-api.glitch.me/player/<b>[Player_Name]</b>/<b>[Character]</b>

<br>

#### You can also get item images using the following parameters:

https://realmeye-api.glitch.me/player/<b>[Player_Name]</b>/<b>[Character]</b>/<b>[Item]</b>\*

##### \*e.g. <br> weapon | ability | armor | ring | set (for the whole set)

<br>

#### To get all character sets at once, use this endpoint instead:

https://realmeye-api.glitch.me/player/<b>[Player_Name]</b>/<b>[Character]</b>/sets

##### (Responds with an object containing an image array buffer for each character)

<br><br>

#### If you want to run the API locally, you can do so by running this command on the terminal:

> npm start

<br><br>

## <b>Dependencies:</b>

<br>

- [express](https://www.npmjs.com/package/express)

- [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)

- [request-ip](https://www.npmjs.com/package/request-ip)

- [cheerio](https://www.npmjs.com/package/cheerio)

- [axios](https://www.npmjs.com/package/axios)

- [canvas](https://www.npmjs.com/package/canvas)

- [node-schedule](https://www.npmjs.com/package/node-schedule)

<br>

##### _If you would like more data scraped from the website or if you've found any issues with the API, message me on discord and I will fix it it - andr123_
