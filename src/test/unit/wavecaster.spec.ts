import * as fs   from "fs";
import * as path from "path";

import {WavecasterScraper} from "../../server/lib/scrapers/sites/wavecaster";
import should = require("should");

describe("wavecaster", () => {
  let result;

  before( async () => {
    const scraper = new WavecasterScraper();
    const file = path.join(__dirname, "..", "files", "wavecaster.html");

    const text = await getFile(file);

    result = scraper.parse(text);

    console.log(result);
  });

  it("should get summary", () => {
    should.equal(result.summary, "One this last day of the year we have a ESE wind & swell at knee to belly high with a 10mph+ SE winds, waves are rideable but not very good, at least the weather is great.")
  });

  it("should get images", () => {
    should.equal(result.images.length, 9);
  });

  it("should get 6 day forecast", () => {
    should.equal(result.forecasts.length, 6);
  });

  it("should get forecast day of week", () => {
    should.equal(result.forecasts[0].day, "Tuesday");
  });

  it("should get forecast rating", () => {
    should.equal(result.forecasts[0].rating, "Fair");
  });

  it("should get forecast summary", () => {
    should.equal(result.forecasts[0].summary, "ESE swell at thigh to waist high+ with 5-10mph WSW/SE winds.");
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
