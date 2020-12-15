import { AppSyncResolverEvent } from "aws-lambda";

import { Ticket, ticketStore } from "../tickets/ticket.model";

export default class ApiService {
  private ticketStore = ticketStore;

  public respond(event: AppSyncResolverEvent<unknown>): unknown {
    switch (event.info.fieldName) {
      case "getTickets":
        return this.ticketStore.scan();
      case "createTicket":
        return this.ticketStore.put(<Ticket>event.arguments);
      default:
        return undefined;
    }
  }
}
