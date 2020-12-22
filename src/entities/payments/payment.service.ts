/* eslint-disable no-console */
import { APIGatewayEvent, AppSyncResolverEvent } from "aws-lambda";
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
  public async onStripeWebhook(event: APIGatewayEvent): Promise<unknown> {
    const signature = event.headers["Stripe-Signature"] ?? "";
    const body = event.body?.toString() ?? "";
    const e = this.stripe.webhooks.constructEvent(unescape(body), signature, appConfig.stripeSigningSecret);
    console.log(e);
    return {
      statusCode: 200,
    };
  }
}
