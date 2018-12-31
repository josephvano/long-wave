import * as should from "should";
import {WavecasterScraper} from "../../server/lib/scrapers/sites/wavecaster";

describe("scraper", () =>{

  describe("wavecaster", () =>{

    it("should fetch wavecaster", async () => {
      const result = await new WavecasterScraper().fetch();

      should.notEqual('', result);
    });

  });
});
