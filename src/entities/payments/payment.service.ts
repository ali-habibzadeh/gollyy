/* eslint-disable no-console */
import { APIGatewayEvent, AppSyncResolverEvent } from "aws-lambda";
import Stripe from "stripe";

import { appConfig } from "../../config/app-config/config.service";
import { Ticket } from "../tickets/ticket.model";
import TicketsRepository from "../tickets/tickets.respository";

interface APIGatewayEventWithRawBody extends APIGatewayEvent {
  rawBody: string;
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
    if (!event.rawBody) {
      throw new Error("No raw body found");
    }
    console.log("event was", event);
    // const raw = Buffer.from(event.rawBody, "base64").toString("utf8");
    const e = this.stripe.webhooks.constructEvent(event.rawBody, signature, appConfig.stripeSigningSecret);
    console.log(e);
    return {
      statusCode: 200,
    };
  }
}
