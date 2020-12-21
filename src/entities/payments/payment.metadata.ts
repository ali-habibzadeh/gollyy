import { AppSyncResolverEvent } from "aws-lambda";

import { Ticket } from "../tickets/ticket.model";

enum PaymentResolverFields {
  createTicket = "createTicket",
}

export const paymentResolvers = [{ typeName: "Mutation", fieldName: PaymentResolverFields.createTicket }];

export const iscreateTicketEvent = (event: AppSyncResolverEvent<unknown>): event is AppSyncResolverEvent<Ticket> =>
  event.info.fieldName === PaymentResolverFields.createTicket;
