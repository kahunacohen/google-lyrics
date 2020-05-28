const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

/**
 * @param songTitle {string} - google query.
 * @returns {string} - The generated page source.
 * @example
 * getGeneratedSource("Hard day's night")
 */
async function getGeneratedSource(songTitle) {
  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(
    songTitle
  )}+lyrics`;
  console.log(googleUrl);
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
  console.log(ret);
}

async function main() {
  const search = process.argv[2];
  const html = await getGeneratedSource(search);
  console.log(parseSource(html));
}

(async () => {
  await main();
})();
