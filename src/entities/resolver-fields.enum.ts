import { tickersResolvers, TicketResolverFields } from "./tickets/tickets.metadata";

export const ResolverFields = <const>{
  ...TicketResolverFields,
};

export const allResolvers = [...tickersResolvers];
