import { AppSyncResolverEvent } from "aws-lambda";
import { Dayjs } from "dayjs";
import { v4 } from "uuid";

import { DynamoStore } from "@shiftcoders/dynamo-easy";

import BaseRepository from "../../@common/base-repository";
import { generateLotteryNumbers } from "../../@common/number-generator";
import { appConfig } from "../../config/app-config/config.service";
import { Ticket } from "./ticket.model";

export default class TicketsRepository extends BaseRepository<Ticket> {
  protected store = new DynamoStore(Ticket);

  public list(event: AppSyncResolverEvent<Ticket>): Promise<Ticket[]> {
    return this.store.scan().whereAttribute("username").eq(event.identity?.username).exec();
  }

  public async create(event: AppSyncResolverEvent<Ticket>): Promise<Ticket> {
    const ticket: Ticket = {
      id: v4(),
      numbers: event.arguments.numbers || generateLotteryNumbers(),
      username: event.identity?.username,
      drawDate: new Dayjs().format("DD-MM-YYYY"),
      ttl: new Dayjs().add(appConfig.dataRetentionDays, "day").unix(),
    };
    await this.store.put({ ...ticket }).exec();
    return ticket;
  }
}
