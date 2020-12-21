import { AppSyncResolverEvent } from "aws-lambda";

import { Ticket } from "../tickets/ticket.model";

enum PaymentResolverFields {
  createPurchase = "createPurchase",
}

export const paymentResolvers = <const>[{ typeName: "Mutation", fieldName: PaymentResolverFields.createPurchase }];

export const iscreateTicketEvent = (event: AppSyncResolverEvent<unknown>): event is AppSyncResolverEvent<Ticket> =>
  event.info.fieldName === PaymentResolverFields.createPurchase;
