import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';
import { Ticket } from './ticket.interface.js';
import { TICKETS } from './tickets.data.js';

@Injectable()
export class TicketsService {
  private readonly tickets: Ticket[] = TICKETS;
  private nextTicketId = 21;

  findAll(priority?: Ticket['priority'], status?: Ticket['status']) {
    let tickets = this.tickets;

    if (priority) {
      tickets = tickets.filter((ticket) => ticket.priority === priority);
    }

    if (status) {
      tickets = tickets.filter((ticket) => ticket.status === status);
    }

    return tickets;
  }

  findOne(id: number) {
    const ticket = this.tickets.find((ticket) => ticket.id === id);

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    return ticket;
  }

  create(createTicketDto: CreateTicketDto) {
    const ticket: Ticket = {
      id: this.nextTicketId++,
      subject: createTicketDto.subject,
      description: createTicketDto.description,
      priority: createTicketDto.priority,
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    this.tickets.push(ticket);

    return ticket;
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    const ticket = this.findOne(id);

    if (ticket.status === 'closed') {
      throw new BadRequestException(
        `Ticket with ID ${id} is closed and cannot be updated`,
      );
    }

    Object.assign(ticket, updateTicketDto);

    return ticket;
  }

  closeTicket(id: number) {
    const ticket = this.findOne(id);

    if (ticket.status === 'closed') {
      throw new BadRequestException(`Ticket with ID ${id} is already closed`);
    }

    ticket.status = 'closed';

    return ticket;
  }
}
