import * as agent                    from "superagent";
import * as cheerio                  from "cheerio";
import {strip}                       from "../../utils";
import {Forecast}                    from "../../../../entity/Forecast";
import {ILogger, Logger, NullLogger} from "../../../../common/logger";
import {inject, injectable}          from "inversify";

type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday" | "Unknown";
const DayRegex = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s?(.*)$/i;

@injectable()
export class WavecasterScraper {
  url = "https://www.thewavecaster.com/";

  constructor(@inject(Logger) public logger?: ILogger){
    if(!this.logger){
      this.logger = new NullLogger();
    }
  }

  async fetch(): Promise<string> {
    const response = await agent.get(this.url);

    return response.text;
  }

  parse(body: string): Forecast {
    const $: CheerioStatic = cheerio.load(body);
    const tables           = $(".widget:nth-child(18) [data-ux='GridCell']");
    const summaryArea      = $(".widget-content:nth-child(4) h4");
    let summary            = "",
          forecasts;

    try {
      summary = strip($(summaryArea[0]).text().replace('Morning Surf Report', ''));

      if (summary.length > 150) {
        summary = summary.substring(0, 150).trim();
      }

      this.logger.debug(`Today's Surf Report Summary: ${summary}`);
    }
    catch (ex) {
      this.logger.warn('Could not parse summary.');
      summary = 'N/A';
    }

    if (tables.length > 1) {

      forecasts = tables
        .map((index: number, el: CheerioElement) => {
          const text = strip($(el).text());

          return {
            day    : this._parseForecastDay(text),
            rating : this.getRating(el),
            summary: this._parseForecastSummary($, el)
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
    return cheerio(content).find("[data-ux='ContentCardButton']").text();
  }

  _parseForecastSummary($: CheerioStatic, element: CheerioElement): string {
    return $(element).find("[data-ux='ContentCardText']").text();
  }

}
