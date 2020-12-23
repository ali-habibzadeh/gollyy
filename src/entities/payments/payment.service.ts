/* eslint-disable no-console */
import { APIGatewayEvent, AppSyncResolverEvent } from "aws-lambda";
import Stripe from "stripe";

import { appConfig } from "../../config/app-config/config.service";
import { Ticket } from "../tickets/ticket.model";
import TicketsRepository from "../tickets/tickets.respository";

interface APIGatewayEventWithRawBody extends APIGatewayEvent {
  raw: string;
}

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

  public async onStripeWebhook(event: APIGatewayEventWithRawBody): Promise<unknown> {
    const signature = event.headers["Stripe-Signature"] ?? "";
    console.log("event was", event);
    const rawBodyAsBuffer = Buffer.from(event.raw, "base64");
    const e = this.stripe.webhooks.constructEvent(rawBodyAsBuffer, signature, appConfig.stripeSigningSecret);
    console.log(e);
    return {
      statusCode: 200,
    };
  }
}
