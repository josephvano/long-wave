import {Connection, createConnection} from "typeorm";

import {WavecasterScraper}         from "../server/lib/scrapers/sites/wavecaster";
import {Forecast, ForecastHash}    from "../entity/Forecast";
import {container}                 from "./container.config";
import {MessagingFormatterHandler} from "../messaging/formatters/messaging.formatter";
import {MessagingService}          from "../messaging/messaging.service";
import {Logger}                    from "../common/logger";
const ormconfig = require("../../ormconfig.json");

const logger = container.get<Logger>(Logger);

const cron = require("node-cron");
let connection;

logger.debug("Initializing jobs application", { namespace: "Jobs"});

const dbConfig = {
  ...ormconfig,
  username: process.env.DB_USERNAME || ormconfig.username || 'longwave',
  password: process.env.DB_PASSWORD || ormconfig.password || '',
  port: process.env.DB_PORT || ormconfig.port,
  host: process.env.DB_HOST || ormconfig.host
};

const init = () => createConnection(dbConfig);

init().then(result => {
  connection = result;

  logger.debug("Connected to database.", { namespace: "Jobs"});

  cron.schedule("*/15 6-12 * * *", () => {
    performTask(connection).then(() => {
      logger.info("Finished task.", {namespace: 'Jobs'});
    });
  }, {
    timezone: "America/New_York"
  });
}).catch( err => {
  console.log("Connection failed");
  logger.error(err);
});

const performTask = async (connection: Connection): Promise<any> => {
  const manager = connection.manager;

  const scraper = container.get(WavecasterScraper);
  const html = await scraper.fetch();
  const result = scraper.parse(html);

  const hash = result.toHash();

  const today = new Date();

  logger.debug(`Pinging ${today}`, {namespace: 'Jobs'});

  const count = await manager.count(ForecastHash, {hash});

  if (count === 0) {
    logger.info("Creating forecast: ", { namespace: 'Jobs', result });
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

