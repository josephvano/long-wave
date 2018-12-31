import * as should         from "should";
import * as fs             from "fs";
import * as path           from "path";
import {WavecasterScraper} from "../../server/lib/scrapers/sites/wavecaster";

describe("scraper", () => {

  describe("wavecaster", () => {

    it("should fetch wavecaster", async () => {
      const result = await new WavecasterScraper().fetch();

      should.notEqual('', result);
    });

    xit("should create file for unit testing", async () => {
      const file = path.join(__dirname, "..", "files", "wavecaster.html");
      const result = await new WavecasterScraper().fetch();

      await writeFile(file, result);
    });

  });
});

const writeFile = (path, data): Promise<string> => new Promise((resolve, reject) => {

  fs.writeFile(path, data, 'utf8', (err) => {
    if (err) {
      reject(err);
    }

    resolve(data);
  });
});
