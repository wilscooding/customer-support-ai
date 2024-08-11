const cheerio = require("cheerio");

const html = "<html><body><p>Hello, World!</p></body></html>";
const $ = cheerio.load(html);
const text = $("p").text();

console.log("Extracted text:", text); // Should log "Hello, World!"
