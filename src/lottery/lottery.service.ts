import DrawsRepository from "../entities/draws/draw.repository";
import { Ticket } from "../entities/tickets/ticket.model";
import TicketsRepository from "../entities/tickets/tickets.respository";

export default class LotteryService {
  private drawsRepository = new DrawsRepository();

  private ticketsRepository = new TicketsRepository();

  public async carryOutDraw(): Promise<Ticket[]> {
    const draw = await this.drawsRepository.create();
    const winners = this.ticketsRepository.listWinners(draw);
    return winners;
    // 1. Create a draw
    // 2. Get all tickets for current draw date
    // 3. Find all the winners
    // 4. Notify the winners
    // 5. Pay them all
  }
}
