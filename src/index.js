const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const EOL = require("os").EOL;

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
  const $ = cheerio.load(html);
  const title = $("div[data-attrid=title] span").first().text();
  const paras = $("div[data-lyricid] div[jsname] div[jsname]");
  let lyrics = [];
  paras.each((i, p) => {
    if (i > 0) {
      lyrics.push("");
      lyrics.push("");
    }
    $("span[jsname]", p).each((_, s) => {
      lyrics.push($(s).text());
    });
  });
  return {title, lyrics};
}
/**
 * Search google for lyrics.
 * @param {string} q
 * @param {String} - "text" or "json"
 * @returns {Array} - An array of lyrics
 * @example
 * await search("orange mandoline wildfire", "text");
 */
async function search(q, format) {
  const html = await getGeneratedSource(q);
  const song = parseSource(html);
  if (format.toLowerCase() === "json") {
    return JSON.stringify(song, null, 2);
  } else if (format.toLowerCase() === "text") {
    return `${song.title}${EOL}${EOL}${song.lyrics.join(EOL)}`;
  } else {
    throw new Error(`format, "${format}" not recognized.`);
  }
}

module.exports = {
  getGeneratedSource,
  parseSource,
  search,
};
