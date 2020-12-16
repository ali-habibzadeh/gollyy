import { AppSyncResolverEvent } from "aws-lambda";

import { Ticket } from "./ticket.model";

export enum TicketResolverFields {
  listTickets = "listTickets",
  createTicket = "createTicket",
}

export function isListTicketsEvent(event: AppSyncResolverEvent<unknown>): event is AppSyncResolverEvent<Ticket> {
  return event.info.fieldName === TicketResolverFields.listTickets;
}

export const iscreateTicketEvent = (event: AppSyncResolverEvent<unknown>): event is AppSyncResolverEvent<Ticket> =>
  event.info.fieldName === TicketResolverFields.createTicket;
