import nodemailer from 'nodemailer';
import { Ticket } from '../types/ticket';

// Email templates
const getTicketCreatedTemplate = (ticket: Ticket) => `
Novo chamado criado:

Título: ${ticket.title}
Descrição: ${ticket.description}
Prioridade: ${ticket.priority}
Status: ${ticket.status}

Data de criação: ${new Date(ticket.createdAt).toLocaleString('pt-BR')}
`;

const getTicketUpdatedTemplate = (ticket: Ticket) => `
Chamado atualizado:

Título: ${ticket.title}
Descrição: ${ticket.description}
Prioridade: ${ticket.priority}
Status: ${ticket.status}

Última atualização: ${new Date(ticket.updatedAt).toLocaleString('pt-BR')}
`;

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
  }

  async sendTicketCreatedEmail(ticket: Ticket, recipientEmail: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: `Novo Chamado: ${ticket.title}`,
        text: getTicketCreatedTemplate(ticket),
      });
      console.log('Email de criação de chamado enviado com sucesso');
    } catch (error) {
      console.error('Erro ao enviar email de criação de chamado:', error);
    }
  }

  async sendTicketUpdatedEmail(ticket: Ticket, recipientEmail: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: `Atualização do Chamado: ${ticket.title}`,
        text: getTicketUpdatedTemplate(ticket),
      });
      console.log('Email de atualização de chamado enviado com sucesso');
    } catch (error) {
      console.error('Erro ao enviar email de atualização de chamado:', error);
    }
  }
}

export const emailService = new EmailService();