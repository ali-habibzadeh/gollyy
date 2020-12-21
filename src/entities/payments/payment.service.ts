import { AppSyncResolverEvent } from "aws-lambda";
import Stripe from "stripe";

import { appConfig } from "../../config/app-config/config.service";
import { Ticket } from "../tickets/ticket.model";

export default class PaymentService {
  private stripe = new Stripe(appConfig.stripeSecretKey, { apiVersion: "2020-08-27" });

  public create(event: AppSyncResolverEvent<Ticket>): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    const { ticketPrice, ticketCurrency: currency } = appConfig;
    return this.stripe.paymentIntents.create({
      amount: ticketPrice * 100,
      currency,
      metadata: {
        username: event.identity?.username ?? "",
        numbers: event.arguments.numbers.toString(),
      },
    });
  }
}
