/* eslint-disable no-console */
import { APIGatewayEvent, AppSyncResolverEvent } from "aws-lambda";
import Stripe from "stripe";

import { appConfig } from "../../config/app-config/config.service";
import { Ticket } from "../tickets/ticket.model";
import TicketsRepository from "../tickets/tickets.respository";

// interface APIGatewayEventWithRawBody extends APIGatewayEvent {
//   rawBody: string;
// }

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

  public async onStripeWebhook(event: APIGatewayEvent): Promise<unknown> {
    const signature = event.headers["Stripe-Signature"] ?? "";
    if (!event.body) {
      throw new Error("No raw body found");
    }
    // const raw = Buffer.from(event.body, "base64").toString("utf8");
    console.log("rawBody was", event.body);
    console.log("signature", signature);
    console.log("appConfig.stripeSigningSecret", appConfig.stripeSigningSecret);
    try {
      this.stripe.webhooks.constructEvent(event.body, signature, appConfig.stripeSigningSecret);
      return {
        statusCode: 200,
        body: JSON.stringify({ received: true }),
      };
    } catch (e) {
      console.log("error", JSON.stringify(e));
      return {
        statusCode: 400,
        body: JSON.stringify(e),
      };
    }
  }
}
