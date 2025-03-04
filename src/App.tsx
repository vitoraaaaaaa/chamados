import React, { useState } from 'react';
import { Ticket } from './types/ticket';
import { User, AuthState } from './types/user';
import { TicketList } from './components/TicketList';
import { NewTicketForm } from './components/NewTicketForm';
import { Login } from './components/Login';
import { AdminPanel } from './components/AdminPanel';
import { TicketResponse } from './components/TicketResponse';
import { DepartmentTickets } from './components/DepartmentTickets';
import { ReportsPanel } from './components/ReportsPanel';
import { EquipmentRequest } from './components/EquipmentRequest';
import { DepartmentTasks } from './components/DepartmentTasks';
import { ThemeToggle } from './components/ThemeToggle';
import { ThemeProvider } from './context/ThemeContext';
import { PlusCircle, ListChecks, LogOut, UserPlus, MessageSquare, Inbox, FileText, Clipboard, Laptop, TicketIcon } from 'lucide-react';

type Screen = 'main' | 'new-ticket' | 'list-tickets' | 'admin' | 'respond-tickets' | 'department-tickets' | 'reports' | 'equipment-request' | 'department-tasks' | 'tickets-menu';

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [currentScreen, setCurrentScreen] = useState<Screen>('main');
  const [auth, setAuth] = useState<AuthState>({
    usuario: null,
    autenticado: false
  });

  const handleLogin = (email: string, senha: string) => {
    // TODO: Implementar autenticação com Supabase
    console.log('Login:', { email, senha });
    setAuth({
      usuario: {
        id: '1',
        nome: 'Usuário Teste',
        cargo: 'admin',
        departamento: 'TI',
        email,
        telefone: '(11) 99999-9999'
      },
      autenticado: true
    });
  };

  const handleForgotPassword = (email: string) => {
    // TODO: Implementar recuperação de senha com Supabase
    console.log('Recuperação de senha para:', email);
  };

  const handleLogout = () => {
    setAuth({
      usuario: null,
      autenticado: false
    });
    setCurrentScreen('main');
  };

  const handleNewTicket = (
    ticketData: Omit<Ticket, 'id' | 'criadoEm' | 'atualizadoEm' | 'criadoPor' | 'atribuidoPara'>
  ) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: crypto.randomUUID(),
      criadoEm: new Date(),
      atualizadoEm: new Date(),
      criadoPor: auth.usuario?.id || '',
      criadoPorNome: auth.usuario?.nome,
      status: 'aberto',
      mensagens: []
    };
    setTickets((prev) => [newTicket, ...prev]);
    setCurrentScreen('list-tickets');
  };

  const handleAssignTicket = (ticketId: string) => {
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          status: 'em_atendimento',
          atribuidoPara: auth.usuario?.departamento,
          atribuidoParaNome: auth.usuario?.nome,
          atualizadoEm: new Date()
        };
      }
      return ticket;
    }));
    setCurrentScreen('respond-tickets');
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
        {!auth.autenticado ? (
          <Login onLogin={handleLogin} />
        ) : (
          <div className="container mx-auto px-4 py-8">
            <header className="bg-white dark:bg-dark-800 shadow-md dark:shadow-dark-900/50">
              <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-center">
                    <img src="/img/logo liga.png" alt="Logo Liga" className="h-12 w-auto object-contain" />
                  </div>
                  <div className="flex items-center space-x-4">
                    <ThemeToggle />
                    <span className="text-gray-600 dark:text-gray-300">Olá, {auth.usuario?.nome}</span>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sair</span>
                    </button>
                  </div>
                </div>
              </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <div className="px-4 py-6 sm:px-0">
                {currentScreen === 'main' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    <button
                      onClick={() => setCurrentScreen('tickets-menu')}
                      className="flex flex-col items-center justify-center p-8 bg-white dark:bg-dark-800 rounded-lg shadow-md hover:shadow-lg transition-shadow space-y-4"
                    >
                      <TicketIcon className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                      <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Chamados</h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">Abra e gerencie seus chamados</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setCurrentScreen('department-tasks')}
                      className="flex flex-col items-center justify-center p-8 bg-white dark:bg-dark-800 rounded-lg shadow-md hover:shadow-lg transition-shadow space-y-4"
                    >
                      <Clipboard className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                      <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Tarefas do Setor</h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">Visualize e gerencie tarefas do seu setor</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setCurrentScreen('equipment-request')}
                      className="flex flex-col items-center justify-center p-8 bg-white dark:bg-dark-800 rounded-lg shadow-md hover:shadow-lg transition-shadow space-y-4"
                    >
                      <Laptop className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                      <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Solicitar Equipamentos</h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">Solicite novos equipamentos para seu setor</p>
                      </div>
                    </button>

                    {auth.usuario?.cargo === 'admin' && auth.usuario.departamento === 'TI' && (
                      <button
                        onClick={() => setCurrentScreen('admin')}
                        className="flex flex-col items-center justify-center p-8 bg-white dark:bg-dark-800 rounded-lg shadow-md hover:shadow-lg transition-shadow space-y-4"
                      >
                        <UserPlus className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                        <div className="text-center">
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Área do Administrador</h2>
                          <p className="mt-2 text-gray-600 dark:text-gray-300">Gerencie usuários e relatórios</p>
                        </div>
                      </button>
                    )}
                  </div>
                ) : currentScreen === 'tickets-menu' ? (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Chamados</h2>
                      <button
                        onClick={() => setCurrentScreen('main')}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        Voltar
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
                      <button
                        onClick={() => setCurrentScreen('new-ticket')}
                        className="flex flex-col items-center justify-center p-8 bg-white dark:bg-dark-800 rounded-lg shadow-md hover:shadow-lg transition-shadow space-y-4"
                      >
                        <PlusCircle className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                        <div className="text-center">
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Abrir Chamado</h2>
                          <p className="mt-2 text-gray-600 dark:text-gray-300">Crie um novo chamado</p>
                        </div>
                      </button>

                      <button
                        onClick={() => setCurrentScreen('list-tickets')}
                        className="flex flex-col items-center justify-center p-8 bg-white dark:bg-dark-800 rounded-lg shadow-md hover:shadow-lg transition-shadow space-y-4"
                      >
                        <ListChecks className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                        <div className="text-center">
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Acompanhar Chamados</h2>
                          <p className="mt-2 text-gray-600 dark:text-gray-300">Visualize e acompanhe seus chamados</p>
                        </div>
                      </button>

                      <button
                        onClick={() => setCurrentScreen('department-tickets')}
                        className="flex flex-col items-center justify-center p-8 bg-white dark:bg-dark-800 rounded-lg shadow-md hover:shadow-lg transition-shadow space-y-4"
                      >
                        <Inbox className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                        <div className="text-center">
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Chamados do Setor</h2>
                          <p className="mt-2 text-gray-600 dark:text-gray-300">Visualize e assuma chamados do seu setor</p>
                        </div>
                      </button>

                      <button
                        onClick={() => setCurrentScreen('respond-tickets')}
                        className="flex flex-col items-center justify-center p-8 bg-white dark:bg-dark-800 rounded-lg shadow-md hover:shadow-lg transition-shadow space-y-4"
                      >
                        <MessageSquare className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                        <div className="text-center">
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Responder Chamados</h2>
                          <p className="mt-2 text-gray-600 dark:text-gray-300">Responda aos chamados assumidos</p>
                        </div>
                      </button>

                      {auth.usuario?.cargo === 'admin' && auth.usuario.departamento === 'TI' && (
                        <button
                          onClick={() => setCurrentScreen('reports')}
                          className="flex flex-col items-center justify-center p-8 bg-white dark:bg-dark-800 rounded-lg shadow-md hover:shadow-lg transition-shadow space-y-4"
                        >
                          <FileText className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                          <div className="text-center">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Relatórios</h2>
                            <p className="mt-2 text-gray-600 dark:text-gray-300">Gere relatórios e estatísticas</p>
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                ) : currentScreen === 'admin' && auth.usuario?.cargo === 'admin' && auth.usuario.departamento === 'TI' ? (
                  <AdminPanel onBack={() => setCurrentScreen('main')} />
                ) : currentScreen === 'reports' && auth.usuario?.cargo === 'admin' && auth.usuario.departamento === 'TI' ? (
                  <ReportsPanel tickets={tickets} onBack={() => setCurrentScreen('tickets-menu')} />
                ) : currentScreen === 'new-ticket' ? (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Novo Chamado</h2>
                      <button
                        onClick={() => setCurrentScreen('tickets-menu')}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        Voltar
                      </button>
                    </div>
                    <div className="bg-white dark:bg-dark-800 shadow rounded-lg p-6">
                      <NewTicketForm onSubmit={handleNewTicket} />
                    </div>
                  </div>
                ) : currentScreen === 'department-tickets' ? (
                  <DepartmentTickets
                    tickets={tickets}
                    userDepartment={auth.usuario?.departamento || ''}
                    onBack={() => setCurrentScreen('tickets-menu')}
                    onAssignTicket={handleAssignTicket}
                  />
                ) : currentScreen === 'respond-tickets' ? (
                  <TicketResponse
                    tickets={tickets}
                    currentUser={auth.usuario}
                    onBack={() => setCurrentScreen('tickets-menu')}
                    onUpdateTickets={setTickets}
                  />
                ) : currentScreen === 'equipment-request' ? (
                  <EquipmentRequest
                    user={auth.usuario}
                    onBack={() => setCurrentScreen('main')}
                  />
                ) : currentScreen === 'department-tasks' ? (
                  <DepartmentTasks
                    department={auth.usuario?.departamento || ''}
                    onBack={() => setCurrentScreen('main')}
                  />
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                        Acompanhar Chamados
                      </h2>
                      <button
                        onClick={() => setCurrentScreen('tickets-menu')}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        Voltar
                      </button>
                    </div>
                    {tickets.length > 0 ? (
                      <TicketList 
                        tickets={tickets} 
                        currentUser={auth.usuario}
                        onUpdateTickets={setTickets}
                      />
                    ) : (
                      <div className="bg-white dark:bg-dark-800 shadow rounded-lg p-6 text-center text-gray-500 dark:text-gray-400">
                        Nenhum chamado registrado ainda.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </main>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;