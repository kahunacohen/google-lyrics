const cheerio = require("cheerio");
const axios = require('axios');

async function getPageSource(title) {
  let resp = null;
  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(title)}+lyrics`;
  console.log(googleUrl);
  try {
    resp = await axios.get(googleUrl);
    return resp.data;
  } catch(e) {
    throw new Error(`Error getting lyrics form ${googleUrl}: `, e.message);
  }
}
async function main() {
  const title = process.argv[2];
  console.log(process.argv)
  const html = await getPageSource(title);
  console.log(html);
}

(async () => {
  await main();
})();