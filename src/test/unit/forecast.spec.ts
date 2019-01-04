import should = require("should");
import {Forecast} from "../../entity/Forecast";

describe("forecast", () => {

  describe("toHash()", () => {

    it("should hash object", () => {
      const hash = new Forecast().toHash();

      should.exist(hash);
    });

    it("should have same hash value", () => {
      let hash = new Forecast().toHash();
      let hash2 = new Forecast().toHash();

      should.equal(hash2, hash);

      hash = new Forecast({summary: "Test"}).toHash();
      hash2 = new Forecast({summary: "Test"}).toHash();

      should.equal(hash2, hash);
    });


    it("should not have same hash value", () => {
      let hash = new Forecast({images: ['1.jpg']}).toHash();
      let hash2 = new Forecast().toHash();

      should.notEqual(hash2, hash);

      hash = new Forecast({summary: "Test", forecasts: [{summary: 'Blah', day: 'Tuesday', rating: 'Poor'}]}).toHash();
      hash2 = new Forecast({summary: "Test"}).toHash();

      should.notEqual(hash2, hash);
    });
  });
});