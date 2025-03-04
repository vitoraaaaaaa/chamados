export type TicketPriority = 'baixa' | 'media' | 'alta';
export type TicketStatus = 'aberto' | 'em_atendimento' | 'resolvido' | 'fechado';
export type Department = 'TI' | 'Televendas' | 'Financeiro' | 'Prevenção de Perdas' | 'Departamento Pessoal' | 'Comercial' | 'Marketing';

export interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  attachments?: {
    type: 'image' | 'video';
    url: string;
  }[];
}

export interface Ticket {
  id: string;
  titulo: string;
  descricao: string;
  prioridade: TicketPriority;
  status: TicketStatus;
  departamento: Department;
  imagens: string[];
  criadoEm: Date;
  atualizadoEm: Date;
  criadoPor: string;
  criadoPorNome?: string;
  atribuidoPara?: string;
  atribuidoParaNome?: string;
  mensagens: Message[];
}