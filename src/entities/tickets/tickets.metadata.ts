import { AppSyncResolverEvent } from "aws-lambda";

import { Ticket } from "./ticket.model";

enum TicketResolverFields {
  listTickets = "listTickets",
}

export const ticketsResolvers = [{ typeName: "Query", fieldName: TicketResolverFields.listTickets }];

export function isListTicketsEvent(event: AppSyncResolverEvent<unknown>): event is AppSyncResolverEvent<Ticket> {
  return event.info.fieldName === TicketResolverFields.listTickets;
}
