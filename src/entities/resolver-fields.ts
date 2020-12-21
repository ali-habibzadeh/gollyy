import { paymentResolvers } from "./payments/payment.metadata";
import { ticketsResolvers } from "./tickets/tickets.metadata";

export const allResolvers = <const>[...ticketsResolvers, ...paymentResolvers];
