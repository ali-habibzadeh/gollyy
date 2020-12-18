import DrawsRepository from "../entities/draws/draw.repository";
import { Ticket } from "../entities/tickets/ticket.model";
import TicketsRepository from "../entities/tickets/tickets.respository";

export class LotteryService {
  private drawsRepository = new DrawsRepository();

  private ticketsRepository = new TicketsRepository();

  public async carryOutDraw(): Promise<Ticket[]> {
    const draw = await this.drawsRepository.create();
    const winners = this.ticketsRepository.listWinners(draw);
    return winners;
  }
}
