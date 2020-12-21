import Stripe from "stripe";

import { appConfig } from "../config/app-config/config.service";

export default class PaymentService {
  private stripe = new Stripe(appConfig.stripeSecretKey, { apiVersion: "2020-08-27" });

  public create(): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    const { ticketPrice, ticketCurrency: currency } = appConfig;
    return this.stripe.paymentIntents.create({ amount: ticketPrice * 100, currency });
  }
}
