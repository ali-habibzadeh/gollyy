import dayjs from "dayjs";
import { v4 } from "uuid";

import { DynamoStore } from "@shiftcoders/dynamo-easy";

import BaseRepository from "../../@common/base-repository";
import { generateLotteryNumbers } from "../../@common/number-generator";
import { appConfig } from "../../config/app-config/config.service";
import { Draw } from "./draw.model";

export default class DrawsRepository extends BaseRepository<Draw> {
  protected store = new DynamoStore(Draw);

  private dataRetentionDays = appConfig.dataRetentionDays;

  public list(): Promise<Draw[]> {
    return this.store.query().exec();
  }

  public async create(): Promise<Draw> {
    const existingDraw = await this.store.scan().whereAttribute("drawDate").eq(dayjs().format("DD-MM-YYYY")).exec();
    if (existingDraw.length) {
      return existingDraw[0];
    }
    const draw = this.getFreshDraw();
    await this.store.put(this.getFreshDraw()).ifNotExists(true).exec();
    return draw;
  }

  private getFreshDraw(): Draw {
    return {
      id: v4(),
      numbers: generateLotteryNumbers(),
      drawDate: dayjs().format("DD-MM-YYYY"),
      ttl: dayjs().add(this.dataRetentionDays, "day").unix(),
    };
  }
}
