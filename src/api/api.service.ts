import { AppSyncResolverEvent } from "aws-lambda";

import { isCreatePurchaseEvent } from "../entities/payments/payment.metadata";
import PaymentService from "../entities/payments/payment.service";
import { isListTicketsEvent } from "../entities/tickets/tickets.metadata";
import TicketsRepository from "../entities/tickets/tickets.respository";

export default class ApiService {
  private ticketRepo = new TicketsRepository();

  private paymentService = new PaymentService();

  public async respond(event: AppSyncResolverEvent<unknown>): Promise<unknown> {
    if (isListTicketsEvent(event)) return this.ticketRepo.list(event);
    if (isCreatePurchaseEvent(event)) return this.paymentService.create(event);
    return null;
  }
}
