import {Forecast}           from "../../entity/Forecast";
import {MessagingFormatter} from "./messaging.formatter";
import {injectable}         from "inversify";

@injectable()
export class WavecasterMessagingFormatter implements MessagingFormatter {
  applies(type: string): boolean {
    return type === "wavecaster";
  }

  format(forecast: Forecast): string {
    const maxDays = 3;

    return forecast.forecasts.reduce((acc, current, index) => {

      if (index >= maxDays) return acc;

      return acc.concat(`\n${current.day} (${current.rating}) ${current.summary}`);
    }, forecast.summary);
  }
}