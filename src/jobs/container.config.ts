import {Container}                                                  from "inversify";
import {IMessagingService, MessagingService}                        from "../messaging/messaging.service";
import {MessagingFormatter, MessagingFormatterHandler, TYPE_SYMBOL} from "../messaging/formatters/messaging.formatter";
import {WavecasterMessagingFormatter}                               from "../messaging/formatters/forecast.formatter";
import {Logger}                                                     from "../common/logger";

const container = new Container();

container.bind<IMessagingService>(MessagingService).to(MessagingService);
container.bind<MessagingFormatterHandler>(MessagingFormatterHandler).to(MessagingFormatterHandler);
container.bind<MessagingFormatter>(TYPE_SYMBOL).to(WavecasterMessagingFormatter);
container.bind<Logger>(Logger).toSelf();

export { container };