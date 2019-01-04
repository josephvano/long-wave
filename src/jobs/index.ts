import {WavecasterScraper}                      from "../server/lib/scrapers/sites/wavecaster";
import {Connection, createConnection}           from "typeorm";
import {Forecast, ForecastHash, ForecastRating} from "../entity/Forecast";

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
    await manager.save(Forecast, result);
    await manager.save(ForecastHash, new ForecastHash("wavecaster", hash, today));
  }

  return 0;
};

