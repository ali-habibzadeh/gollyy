import { v4 } from "uuid";

import { DynamoStore } from "@shiftcoders/dynamo-easy";

import BaseRepository from "../../@common/base-repository";
import { Ticket } from "./ticket.model";

export default class TicketsRepository extends BaseRepository<Ticket> {
  protected store = new DynamoStore(Ticket);

  public list(): Promise<Ticket[]> {
    return this.store.scan().exec();
  }

  public async create(numbers: [number, number]): Promise<Ticket> {
    const ticket = { numbers, id: v4() };
    await this.store.put(ticket).exec();
    return ticket;
  }
}
