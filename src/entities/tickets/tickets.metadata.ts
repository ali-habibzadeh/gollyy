import { AppSyncResolverEvent } from "aws-lambda";

import { Ticket } from "./ticket.model";

enum TicketResolverFields {
  listTickets = "listTickets",
  createTicket = "createTicket",
}

export const ticketsResolvers = [
  {
    typeName: "Query",
    fieldName: TicketResolverFields.listTickets,
  },
  {
    typeName: "Mutation",
    fieldName: TicketResolverFields.createTicket,
  },
];

export function isListTicketsEvent(event: AppSyncResolverEvent<unknown>): event is AppSyncResolverEvent<Ticket> {
  return event.info.fieldName === TicketResolverFields.listTickets;
}

export const iscreateTicketEvent = (event: AppSyncResolverEvent<unknown>): event is AppSyncResolverEvent<Ticket> =>
  event.info.fieldName === TicketResolverFields.createTicket;
