import { AppSyncResolverEvent } from "aws-lambda";
import dayjs from "dayjs";
import { v4 } from "uuid";

import { and, attribute, DynamoStore, or, ScanResponse } from "@shiftcoders/dynamo-easy";

import BaseRepository from "../../@common/base-repository";
import { generateLotteryNumbers } from "../../@common/number-generator";
import { appConfig } from "../../config/app-config/config.service";
import { Draw } from "../draws/draw.model";
import { Ticket } from "./ticket.model";

export default class TicketsRepository extends BaseRepository<Ticket> {
  protected store = new DynamoStore(Ticket);

  public list(event: AppSyncResolverEvent<Ticket>): Promise<Ticket[]> {
    return this.store.scan().whereAttribute("username").eq(event.identity?.username).exec();
  }

  public listWinners(draw: Draw): Promise<ScanResponse<Ticket>> {
    return this.store
      .scan()
      .where(
        or(
          and(attribute("drawDate").eq(draw.drawDate), attribute("numbers").eq(draw.numbers)),
          and(attribute("drawDate").eq(draw.drawDate), attribute("numbers").contains(draw.numbers[0])),
          and(attribute("drawDate").eq(draw.drawDate), attribute("numbers").contains(draw.numbers[1])),
        ),
      )
      .execFullResponse();
  }

  public async create(event: AppSyncResolverEvent<Ticket>): Promise<Ticket> {
    const ticket: Ticket = {
      id: v4(),
      numbers: event.arguments.numbers ?? generateLotteryNumbers(),
      username: event.identity?.username,
      drawDate: dayjs().format("DD-MM-YYYY"),
      ttl: dayjs().add(appConfig.dataRetentionDays, "day").unix(),
    };
    await this.store.put({ ...ticket }).exec();
    return ticket;
  }
}
