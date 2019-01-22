import * as cheerio from "cheerio";

import * as fs   from "fs";
import * as path from "path";

import {WavecasterScraper} from "../../server/lib/scrapers/sites/wavecaster";
import should = require("should");

describe("parse rating", () => {

  it("should handle nested fonts", () => {
    const scrapper          = new WavecasterScraper();
    const html              = '<table><tr><td valign=\"top\"><font style=\"font-size: 18px;\"><b><font color=\"#007f00\"><font color=\"#ff7f00\">Wednesday</font> <font color=\"#000000\">NE swell at rib to head high with 10-15mph NNW/NE winds.</font></font></b></font> <br></td></tr></table>';
    const $: CheerioStatic = cheerio.load(html);

    const el = $('tr');
    let result = scrapper.getRating(el[0]);

    should.equal(result, "Fair");
  });
});

describe("wavecaster", () => {
  let result;

  before(async () => {
    const scraper = new WavecasterScraper();
    const file    = path.join(__dirname, "..", "files", "wavecaster.html");

    const text = await getFile(file);

    result = scraper.parse(text);
  });

  it("should get summary", () => {
    console.log(result);
    should.equal(result.summary, "This Monday morning we have a NE wind swell at knee high with 10-15mph NNW winds, not much today, gets better mid-week.");
  });

  it("should get images", () => {
    should.equal(result.images.length, 1);
  });

  it("should get 6 day forecast", () => {
    should.equal(result.forecasts.length, 6);
  });

  it("should get forecast day of week", () => {
    should.equal(result.forecasts[0].day, "Tuesday");
  });

  it("should get forecast rating", () => {
    should.equal(result.forecasts[0].rating, "Poor");
  });

  it("should get forecast summary", () => {
    should.equal(result.forecasts[0].summary, "E wind swell at knee to waist high with 15-20mph E winds.");
  });
});

const getFile = (path): Promise<string> => new Promise((resolve, reject) => {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      reject(err);
    }

    resolve(data);
  });
});
