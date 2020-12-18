import dayjs from "dayjs";
import { v4 } from "uuid";

import { DynamoStore } from "@shiftcoders/dynamo-easy";

import BaseRepository from "../../@common/base-repository";
import { generateLotteryNumbers } from "../../@common/number-generator";
import { appConfig } from "../../config/app-config/config.service";
import { Draw } from "./draw.model";

export default class DrawsRepository extends BaseRepository<Draw> {
  protected store = new DynamoStore(Draw);

  public list(): Promise<Draw[]> {
    return this.store.query().exec();
  }

  public async create(): Promise<Draw> {
    const draw: Draw = {
      id: v4(),
      numbers: generateLotteryNumbers(),
      drawDate: dayjs().format("DD-MM-YYYY"),
      ttl: dayjs().add(appConfig.dataRetentionDays, "day").unix(),
    };
    await this.store.put({ ...draw }).exec();
    return draw;
  }
}
