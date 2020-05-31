const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

/**
 * @param search {string} - google query.
 * @returns {string} - The generated page source.
 * @example
 * getGeneratedSource("Hard day's night beatles")
 */
async function getGeneratedSource(search) {
  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(
    search
  )}+lyrics`;
  const browser = await puppeteer.launch();
  let page;
  try {
    page = await browser.newPage();
    await page.goto(googleUrl);
    const html = await page.content();
    return html;
  } finally {
    browser.close();
  }
}

/**
 *
 * @param {string} html - Generated html from a google search on lyrics.
 * @returns {Array} - An object representing the lyrics.
 */
function parseSource(html) {
  let ret = [];
  const $ = cheerio.load(html);
  const paras = $("div[data-lyricid] div[jsname] div[jsname]");
  paras.each((i, p) => {
    if (i > 0) {
      ret.push("");
      ret.push("");
    }
    $("span[jsname]", p).each((_, s) => {
      ret.push($(s).text());
    });
  });
  return ret;
}

async function main() {
  const search = process.argv[2];
  const html = await getGeneratedSource(search);
  console.log(JSON.stringify(parseSource(html), null, 2));
}

(async () => {
  await main();
})();

exports = {
  getGeneratedSource,
  parseSource,
};
