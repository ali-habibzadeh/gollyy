import Stripe from "stripe";

import { appConfig } from "../config/app-config/config.service";

export default class PaymentService {
  private stripe = new Stripe(appConfig.stripeSecretKey, { apiVersion: "2020-08-27" });

  public createIntent(): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    const { ticketPrice: amount, ticketCurrency: currency } = appConfig;
    return this.stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { uid: "testTicketPayment" },
    });
  }
}
