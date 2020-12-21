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
    const todaysDate = dayjs().format("DD-MM-YYYY");
    const existingDraw = (await this.store.scan().whereAttribute("drawDate").eq(todaysDate).exec())[0];
    if (existingDraw) return existingDraw;
    const draw = this.getFreshDraw(todaysDate);
    await this.store.put(draw).exec();
    return draw;
  }

  private getFreshDraw(drawDate: string): Draw {
    return {
      id: v4(),
      numbers: generateLotteryNumbers(),
      drawDate,
      ttl: dayjs().add(this.dataRetentionDays, "day").unix(),
    };
  }
}
