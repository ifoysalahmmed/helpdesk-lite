import { Injectable, NotFoundException } from '@nestjs/common';
import { Ticket } from './ticket.interface.js';

@Injectable()
export class TicketsService {
  private readonly tickets: Ticket[] = [
    {
      id: 1,
      subject: 'Cannot login to account',
      description: 'User cannot access the dashboard after login',
      priority: 'high',
      status: 'open',
      createdAt: '2026-09-01T10:00:00.000Z',
    },
    {
      id: 2,
      subject: 'Invoice PDF not downloading',
      description:
        'Clicking the download button on the billing page does nothing',
      priority: 'medium',
      status: 'open',
      createdAt: '2026-09-02T14:30:00.000Z',
    },
    {
      id: 3,
      subject: 'Typo on pricing page',
      description:
        'The word "monthly" is misspelled in the pricing table header',
      priority: 'low',
      status: 'closed',
      createdAt: '2026-09-03T09:15:00.000Z',
    },
  ];

  findAll() {
    return this.tickets;
  }

  findOne(id: number) {
    const ticket = this.tickets.find((ticket) => ticket.id === id);

    if (!ticket) throw new NotFoundException(`Ticket with ID ${id} not found`);

    return ticket;
  }
}
