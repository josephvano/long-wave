import * as hash    from "object-hash";
import * as agent   from "superagent";
import * as cheerio from "cheerio";
import {strip}      from "../../utils";

type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday" | "Unknown";
const DayRegex = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s?(.*)$/;

class ForecastRating {
  day: string;
  summary: string;
  rating: string;
}

export class Forecast {
  summary: string;
  forecasts: ForecastRating[];
  images?: string[];

  constructor(values?: Partial<Forecast>){
    Object.assign(this, values);
  }

  toHash(): string {
    return hash(this);
  }
}

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
            rating : this._parseForecastRating(el),
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

  _parseForecastRating(content: CheerioElement): string {
    let rating = "#007f00";

    cheerio(content).find("font").map((ix: number, element: CheerioElement) => {
      const day = cheerio(element).text();
      const result = day.match(DayRegex);

      if (result) {
        rating = element.attribs["color"];
      }
    }).get();

    switch (rating) {
      case "#007f00":
        return "Poor";
      case "#bf5f00":
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
