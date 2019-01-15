import * as agent   from "superagent";
import * as cheerio from "cheerio";
import {strip}      from "../../utils";
import {Forecast}   from "../../../../entity/Forecast";
import moment = require("moment");

type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday" | "Unknown";
const DayRegex = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s?(.*)$/;

export class WavecasterScraper {
  url = "https://www.thewavecaster.com/";

  async fetch(): Promise<string> {
    const response = await agent.get(this.url);

    return response.text;
  }

  parse(body: string): Forecast {
    const $ = cheerio.load(body);
    const tables = $("table");
    let summary = "",
      forecasts;

    if (tables.length > 1) {
      summary = strip(tables.first().text());

      forecasts = tables
        .eq(1)
        .find("tr")
        .map((index: number, el: CheerioElement) => {
          const text = strip($(el).text());

          return {
            day    : this._parseForecastDay(text),
            rating : this.getRating(el),
            summary: this._parseForecastSummary(text)
          }
        }).get();
    }

    const images = $(".LayoutContainer div div div div:nth-child(3)")
      .first()
      .children("img")
      .get()
      .map((el: CheerioElement) => el.attribs['src']);

    return new Forecast({
      summary,
      images,
      forecasts
    });
  }

  _parseForecastDay(content: string): DayOfWeek | string {
    const result = content.match(DayRegex);

    if (result) {
      return result[1];
    }

    return "Unknown";
  }

  getRating(content: CheerioElement): string {
    let rating = "#007f00";
    const ignoreColors = {
      "#007f00": true,
      "#000000": true,
    };

    cheerio(content).find("font").map((ix: number, element: CheerioElement) => {
      const day = cheerio(element).text();
      const result = day.match(DayRegex);

      const color = element.attribs["color"];

      if (result && color && !ignoreColors[color]) {
        rating = color;
      }
    }).get();

    switch (rating) {
      case "#007f00":
        return "Poor";
      case "#bf5f00":
      case "#ff7f00":
        return "Fair";
      case "#bf0000":
        return "Good";
      default:
        return "Poor"
    }
  }

  _parseForecastSummary(content: string): string {
    const result = content.match(DayRegex);

    if (result && result.length > 1) {
      return result[2];
    }

    return "";
  }

}
