const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const EOL = require("os").EOL;

/**
 * @param {string} search {string} - google query.
 * @param {object} opts - An options object with:
 *   - keepBrowserOpen boolean
 *   - headless boolean
 *
 * @returns {string} - The generated page source.
 * @example
 * getGeneratedSource("Hard day's night beatles")
 */
async function getGeneratedSource(search, opts) {
  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(
    search
  )}+lyrics`;
  const browser = await puppeteer.launch({
    headless: !opts.headful,
    args: ['--lang="en-US"'],
  });
  let page;
  try {
    page = await browser.newPage();
    await page.goto(googleUrl);
    const l = await page.evaluate((x) => navigator.language);
    console.log(l);
    const html = await page.content();
    return html;
  } finally {
    if (!opts.keepBrowserOpen) {
      browser.close();
    }
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
  const author = $("div[data-attrid=subtitle] span a").text();

  const paras = $("div[data-lyricid] div[jsname] div[jsname]");
  let lyrics = [];
  paras.each((i, p) => {
    if (i > 0) {
      lyrics.push("");
    }
    $("span[jsname]", p).each((_, s) => {
      lyrics.push($(s).text());
    });
  });
  return { title, author, lyrics };
}
/**
 * Search google for lyrics.
 * @param {string} q
 * @param {String} - "text" or "json"
 * @returns {Array} - An array of lyrics
 * @example
 * await search("orange mandoline wildfire", "text");
 */
async function search(q, opts) {
  const html = await getGeneratedSource(q, {
    closeBrowser: opts.closeBrowser,
    headful: opts.headful,
    keepBrowserOpen: opts.keepBrowserOpen,
  });
  const song = parseSource(html);
  if (opts.format.toLowerCase() === "json") {
    return JSON.stringify(song, null, 2);
  } else if (opts.format.toLowerCase() === "text") {
    return `${song.title}${EOL}${EOL}${song.lyrics.join(EOL)}`;
  } else {
    throw new Error(`format, "${opts.format}" not recognized.`);
  }
}

module.exports = {
  getGeneratedSource,
  parseSource,
  search,
};
