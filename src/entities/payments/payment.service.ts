import { AppSyncResolverEvent } from "aws-lambda";
import Stripe from "stripe";

import { appConfig } from "../../config/app-config/config.service";
import { Ticket } from "../tickets/ticket.model";
import TicketsRepository from "../tickets/tickets.respository";

export default class PaymentService {
  private ticketsRepository = new TicketsRepository();

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

  // eslint-disable-next-line class-methods-use-this
  public async onStripeWebhook(event: AppSyncResolverEvent<Ticket>): Promise<void> {
    // eslint-disable-next-line no-console
    return console.log(event);
    // return this.ticketsRepository.create(event);
  }
}
