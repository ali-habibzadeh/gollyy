import { AppSyncResolverEvent } from "aws-lambda";
import { v4 } from "uuid";

import { DynamoStore } from "@shiftcoders/dynamo-easy";

import { Ticket } from "../tickets/ticket.model";

export default class ApiService {
  private ticketStore = new DynamoStore(Ticket);

  public async respond(event: AppSyncResolverEvent<any>): Promise<unknown> {
    // eslint-disable-next-line no-console
    switch (event.info.fieldName) {
      case "listTickets":
        return this.ticketStore.scan().exec();
      case "createTicket":
        // eslint-disable-next-line no-case-declarations
        const ticket = { numbers: event.arguments.numbers, id: v4() };
        await this.ticketStore.put(ticket).exec();
        return ticket;
      default:
        return null;
    }
  }
}
