import {Forecast, ForecastRating}     from "../../entity/Forecast";
import {WavecasterMessagingFormatter} from "../../messaging/formatters/forecast.formatter";
import should = require("should");

describe("messaging formatter", () =>{
  let result: string;

  before(() => {
    const forecast = new Forecast({
      summary: "This is bad weather.",
      forecasts: [
        new ForecastRating({
          rating: 'Poor',
          day: 'Saturday',
          summary: "NO bueno"
        }),
        new ForecastRating({
          rating: 'Fair',
          day: 'Sunday',
          summary: "Si bueno"
        }),
        new ForecastRating({
          rating: 'Good',
          day: 'Monday',
          summary: "OK"
        }),
        new ForecastRating({
          rating: 'Ignored',
          day: 'Tuesday',
          summary: "OK"
        }),
        new ForecastRating({
          rating: 'Ignored',
          day: 'Wednesday',
          summary: "OK"
        }),
      ]
    });

    const formatter = new WavecasterMessagingFormatter();

    result = formatter.format(forecast);
  });

  it("should contain day after", () => {

    should(result).containEql('Saturday');
  });

  it("should not contain day further out than 3 days", () => {

    should(result).not.containEql('Tuesday');
    should(result).not.containEql('Wednesday');
  });
});