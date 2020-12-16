import { AppSyncResolverEvent } from "aws-lambda";

import { iscreateTicketEvent, isListTicketsEvent } from "../entities/tickets/tickets.metadata";
import TicketsRepository from "../entities/tickets/tickets.respository";

export default class ApiService {
  private ticketRepo = new TicketsRepository();

  public async respond(event: AppSyncResolverEvent<unknown>): Promise<unknown> {
    if (isListTicketsEvent(event)) return this.ticketRepo.list(event);
    if (iscreateTicketEvent(event)) return this.ticketRepo.create(event);
    return null;
  }
}
