import {WavecasterScraper}                      from "../server/lib/scrapers/sites/wavecaster";
import {Connection, createConnection}           from "typeorm";
import {Forecast, ForecastHash, ForecastRating} from "../entity/Forecast";
import { container }                            from "./container.config";
import {MessagingFormatterHandler}              from "../messaging/formatters/messaging.formatter";
import {IMessagingService, MessagingService}    from "../messaging/messaging.service";

const cron = require("node-cron");
let connection;

console.log("Path: ", __dirname);

const init = () => createConnection();

init().then(result => {
  connection = result;
  cron.schedule("*/15 6-12 * * *", () => {
    performTask(connection).then(() => {
      console.log("Finished.")
    });
  });
});

const performTask = async (connection: Connection): Promise<any> => {
  const manager = connection.manager;

  const scraper = new WavecasterScraper();
  const html = await scraper.fetch();
  const result = scraper.parse(html);

  const hash = result.toHash();

  const today = new Date();

  console.log("Pinging: ", today);
  console.log(hash);

  const count = await manager.count(ForecastHash, {hash});

  if (count === 0) {
    console.log("Creating forecast: ", result);
    const forecastHash = new ForecastHash("wavecaster", hash, today);

    const messagingFormatter = container.get(MessagingFormatterHandler);
    const body = messagingFormatter.format(forecastHash.type, result);
    const messagingService = container.get(MessagingService);
    await messagingService.send("14074211774", body);

    await manager.save(Forecast, result);
    await manager.save(ForecastHash, forecastHash);
  }

  return 0;
};

