import {Container}                                                  from "inversify";
import {IMessagingService, MessagingService}                        from "../messaging/messaging.service";
import {MessagingFormatter, MessagingFormatterHandler, TYPE_SYMBOL} from "../messaging/formatters/messaging.formatter";
import {WavecasterMessagingFormatter}                               from "../messaging/formatters/forecast.formatter";
import {Logger}                                                     from "../common/logger";
import {WavecasterScraper}                                          from "../server/lib/scrapers/sites/wavecaster";

const container = new Container();

const logPath = process.env.LONGWAVE_LOG_PATH || '/var/log/longwave';

container.bind<IMessagingService>(MessagingService).to(MessagingService);
container.bind<WavecasterScraper>(WavecasterScraper).toSelf();
container.bind<MessagingFormatterHandler>(MessagingFormatterHandler).to(MessagingFormatterHandler);
container.bind<MessagingFormatter>(TYPE_SYMBOL).to(WavecasterMessagingFormatter);
container.bind<Logger>(Logger).toConstantValue(new Logger("jobs", logPath));

export { container };