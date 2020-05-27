const cheerio = require("cheerio");
const axios = require('axios');
const puppeteer = require('puppeteer');


async function getPageSource(title) {
  let resp = null;
  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(title)}+lyrics`;
  console.log(googleUrl);
  try {
    resp = await axios.get(googleUrl);
    return resp.data;
  } catch (e) {
    throw new Error(`Error getting lyrics form ${googleUrl}: `, e.message);
  }
}
function parse(html) {
  const $ = cheerio.load(html);
  console.log(html)

  console.log($("span").length);

}
async function main() {

  const search = process.argv[2];
  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(search)}+lyrics`;
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.goto(googleUrl);
    const html = await page.content();
    const $ = cheerio.load(html);
    const lyricEl = $("div[data-lyricid]").text();
    console.log(lyricEl)
  } finally {
    browser.close();
  }
}

(async () => {
  await main();
})();