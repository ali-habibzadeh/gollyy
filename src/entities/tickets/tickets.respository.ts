import { AppSyncResolverEvent } from "aws-lambda";
import { v4 } from "uuid";

import { DynamoStore } from "@shiftcoders/dynamo-easy";

import BaseRepository from "../../@common/base-repository";
import { Ticket } from "./ticket.model";

export default class TicketsRepository extends BaseRepository<Ticket> {
  protected store = new DynamoStore(Ticket);

  public list(event: AppSyncResolverEvent<Ticket>): Promise<Ticket[]> {
    return this.store.scan().whereAttribute("username").eq(event.identity?.username).exec();
  }

  public async create(event: AppSyncResolverEvent<Ticket>): Promise<Ticket> {
    const ticket = { numbers: event.arguments.numbers, id: v4(), username: event.identity?.username };
    await this.store.put(ticket).exec();
    return ticket;
  }
}
