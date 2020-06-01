# google-lyrics

A JavaScript webscraper which tries to get lyrics from a simple google search.

## Caveats
* Proper use of an artist's lyrics in relation to copyright laws is the users' responsiblity. Respect artist's copyrights.
* Because this is a screen-scraper the parsing of Google's search results is brittle and relies on a specific DOM structure. If
you rely on this module, keep an eye out on whether it continues to work. 

## Install
`$ npm install google-lyrics`

## Use
The package installs the script `google-lyrics` into your path, so you can do:

```
$ google-lyrics "row row row your boat"
google-lyrics "row row row your boat"
[
  "Row, row, row your boat",
  "Gently down the stream",
  "Merrily merrily, merrily, merrily",
  "Life is but a dream",
  "",
  "",
  "Row, row, row your boat",
  "Gently down the stream",
  "Merrily merrily, merrily, merrily",
  "Life is but a dream",
  "",
  "",
  "Row, row, row your boat",
  "Gently down the stream",
  "Merrily merrily, merrily,",
  "",
  "",
  "Row, row, row your boat",
  "Gently down the stream",
  "Merrily merrily, merrily, merrily",
  "Life is but a dream",
  "",
  "",
  "Row, row, row your boat",
  "Gently down the stream",
  "Merrily merrily, merrily, merrily",
  "Life is but a dream"
]
```

You can also use as a module in another node script:

```js
const { search } = require("google-lyrics");

search("row row row your boat").then(lyrics => console.log(lyrics));
```

You can also import from `google-lyrics` `getGeneratedSource`, which takes a search term as a parameter and returns
a promise with the JavaScript generated source from google and `parseSource` which takes the generated HTML from `getGeneratedSource`
and parses into JSON.
