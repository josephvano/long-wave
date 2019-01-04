import {Twilio}     from "twilio";
import {injectable} from "inversify";

const accountSid = process.env.TWILIO_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_TOKEN;   // Your Auth Token from www.twilio.com/console
const twilioNumber = "***REMOVED***";

export interface IMessagingService{
  send(to: string, body: string): Promise<any>;
}

@injectable()
export class MessagingService implements IMessagingService {
  client: Twilio;

  constructor() {
    this.client = new Twilio(accountSid, authToken);
  }

  send(to: string, body: string): Promise<any> {
    return this.client.messages.create({
      body,
      to,  // Text this number
      from: twilioNumber
    }).then((message) => console.log(message.sid))
      .catch(err => console.log(err));
  }
}