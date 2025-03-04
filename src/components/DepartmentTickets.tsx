import React from 'react';
import { Ticket } from '../types/ticket';
import { ArrowLeft, Clock, AlertTriangle } from 'lucide-react';

interface DepartmentTicketsProps {
  tickets: Ticket[];
  userDepartment: string;
  onBack: () => void;
  onAssignTicket: (ticketId: string) => void;
}

export function DepartmentTickets({ tickets, userDepartment, onBack, onAssignTicket }: DepartmentTicketsProps) {
  // Filtrar apenas chamados abertos para o departamento do usuário
  const departmentTickets = tickets.filter(
    ticket => ticket.departamento === userDepartment && ticket.status === 'aberto'
  );

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return 'text-red-600 bg-red-50';
      case 'media':
        return 'text-yellow-600 bg-yellow-50';
      case 'baixa':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Chamados do Setor - {userDepartment}</h2>
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar ao Menu
        </button>
      </div>

      {departmentTickets.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {departmentTickets.map((ticket) => (
              <li key={ticket.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {ticket.titulo}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.prioridade)}`}>
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        {ticket.prioridade.charAt(0).toUpperCase() + ticket.prioridade.slice(1)}
                      </span>
                      <button
                        onClick={() => onAssignTicket(ticket.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Assumir
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Aberto por: {ticket.criadoPorNome || 'Usuário'}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Aberto em: {new Date(ticket.criadoEm).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
          Nenhum chamado aberto para este setor.
        </div>
      )}
    </div>
  );
}