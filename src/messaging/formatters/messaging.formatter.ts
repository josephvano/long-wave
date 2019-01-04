import {Forecast}                from "../../entity/Forecast";
import {injectable, multiInject} from "inversify";

export interface MessagingFormatter {
  applies(type: string): boolean;

  format(forecast: Forecast): string;
}

export const TYPE_SYMBOL = "MessagingFormatters";

@injectable()
export class MessagingFormatterHandler {
  private formatters: MessagingFormatter[];

  constructor(@multiInject(TYPE_SYMBOL)formatters: MessagingFormatter[]) {
    this.formatters = formatters;
  }

  format(type: string, forecast: Forecast) {
    const formatter = this.formatters.find(x => x.applies(type));

    if (!formatter) {
      throw new Error(`Could not find a formatter for ${type}`);
    }

    return formatter.format(forecast);
  }
}