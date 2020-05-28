const cheerio = require("cheerio");
const puppeteer = require('puppeteer');

/**
 * @param songTitle {string} - google query.
 * @returns {string} - The generated page source.
 * @example
 * getGeneratedSource("Hard day's night")
 */
async function getGeneratedSource(songTitle) {
  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(songTitle)}+lyrics`;
  console.log(googleUrl)
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.goto(googleUrl);
    const html = await page.content();
    return html;
  } finally {
    browser.close();
  }
}

function parseSource(html) {
  console.log("here")
  console.log(html);
  let ret = [];
  const $ = cheerio.load(html);
  const paras = $("div[data-lyricid] div[jsname]");
  paras.each((i, p) => {
    if (i > 0) {
      ret.push("");
    }
    for (const c of p.childNodes) {
      if (c.tagName === "span" && c.firstChild.tagName) {
        console.log(c.textContent)
        // for (const x in c) {
        //   console.log(x)
        // }
      }
    }
  })
  console.log(ret)
}

async function main() {
  const search = process.argv[2];
  const html = await getGeneratedSource(search);
  console.log(parseSource(html));
  
}

(async () => {
  await main();
})();