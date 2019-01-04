import {Twilio}             from "twilio";
import {inject, injectable} from "inversify";
import {Logger}             from "../common/logger";

const accountSid   = process.env.TWILIO_SID;      // Your Account SID from www.twilio.com/console
const authToken    = process.env.TWILIO_TOKEN;    // Your Auth Token from www.twilio.com/console
const twilioNumber = process.env.TWILIO_NUMBER;

export interface IMessagingService {
  send(to: string, body: string): Promise<boolean>;
}

@injectable()
export class MessagingService implements IMessagingService {
  client: Twilio;
  private logger: Logger;

  constructor(@inject(Logger) logger) {
    this.client = new Twilio(accountSid, authToken);
    this.logger = logger;
  }

  send(to: string, body: string): Promise<boolean> {
    return this.client.messages.create({
      body,
      to,  // Text this number
      from: twilioNumber
    }).then((message) => {
      this.logger.info(`Successfully sent SMS to ${to}: ${message.sid}`);

      return true;
    }).catch(err => {
      this.logger.error(err);

      return false;
    });
  }
}