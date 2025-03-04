import React, { useState, useRef } from 'react';
import { Ticket, Message } from '../types/ticket';
import { User } from '../types/user';
import { 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  Building2, 
  Send, 
  Paperclip,
  Calendar,
  Search,
  Filter,
  X,
  Clock,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock4
} from 'lucide-react';

interface TicketListProps {
  tickets: Ticket[];
  currentUser: User | null;
  onUpdateTickets: (tickets: Ticket[]) => void;
}

export function TicketList({ tickets, currentUser, onUpdateTickets }: TicketListProps) {
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<string>('');
  const [attachments, setAttachments] = useState<{ [key: string]: File[]}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [ordenacao, setOrdenacao] = useState({ campo: 'criadoEm', ordem: 'desc' });
  const [filtro, setFiltro] = useState({
    status: '',
    departamento: '',
    prioridade: '',
    dataInicio: '',
    dataFim: ''
  });
  
  const messageEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (ticketId: string) => {
    if (!newMessage.trim() && (!attachments[ticketId] || attachments[ticketId].length === 0)) return;

    const newMessageObj: Message = {
      id: crypto.randomUUID(),
      userId: currentUser?.id || '',
      userName: currentUser?.nome || '',
      content: newMessage,
      timestamp: new Date(),
      attachments: attachments[ticketId]?.map(file => ({
        type: file.type.startsWith('image/') ? 'image' : 'video',
        url: URL.createObjectURL(file)
      }))
    };

    onUpdateTickets(tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          mensagens: [...ticket.mensagens, newMessageObj],
          atualizadoEm: new Date()
        };
      }
      return ticket;
    }));

    setNewMessage('');
    setAttachments(prev => ({ ...prev, [ticketId]: [] }));
    setTimeout(scrollToBottom, 100);
  };

  const handleFinishTicket = (ticketId: string) => {
    if (window.confirm('Tem certeza que deseja finalizar este chamado?')) {
      onUpdateTickets(tickets.map(ticket => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            status: 'resolvido',
            atualizadoEm: new Date()
          };
        }
        return ticket;
      }));
      
      const mensagemFinalizacao: Message = {
        id: crypto.randomUUID(),
        userId: currentUser?.id || '',
        userName: currentUser?.nome || '',
        content: 'Chamado finalizado',
        timestamp: new Date(),
        attachments: []
      };

      onUpdateTickets(tickets.map(ticket => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            mensagens: [...ticket.mensagens, mensagemFinalizacao]
          };
        }
        return ticket;
      }));
    }
  };

  const handleAttachment = (ticketId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isValidSize = file.size <= 10 * 1024 * 1024;
      return (isImage || isVideo) && isValidSize;
    });

    setAttachments(prev => ({
      ...prev,
      [ticketId]: [...(prev[ticketId] || []), ...validFiles]
    }));
  };

  const toggleTicket = (ticketId: string) => {
    setExpandedTicket(expandedTicket === ticketId ? null : ticketId);
    setTimeout(scrollToBottom, 100);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aberto':
        return <AlertCircle className="w-4 h-4" />;
      case 'em_atendimento':
        return <Clock4 className="w-4 h-4" />;
      case 'resolvido':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'fechado':
        return <X className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aberto':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'em_atendimento':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolvido':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'fechado':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baixa':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const limparFiltros = () => {
    setFiltro({
      status: '',
      departamento: '',
      prioridade: '',
      dataInicio: '',
      dataFim: ''
    });
    setSearchTerm('');
  };

  const ordenarChamados = (chamados: Ticket[]) => {
    return [...chamados].sort((a, b) => {
      if (ordenacao.campo === 'criadoEm') {
        return ordenacao.ordem === 'asc' 
          ? new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime()
          : new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime();
      } else if (ordenacao.campo === 'prioridade') {
        const prioridadeValor = { alta: 3, media: 2, baixa: 1 };
        const valorA = prioridadeValor[a.prioridade as keyof typeof prioridadeValor] || 0;
        const valorB = prioridadeValor[b.prioridade as keyof typeof prioridadeValor] || 0;
        return ordenacao.ordem === 'asc' ? valorA - valorB : valorB - valorA;
      }
      return 0;
    });
  };

  const chamadosFiltrados = tickets
    .filter(ticket => {
      const matchesSearch = searchTerm === '' || 
        ticket.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.descricao.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesStatus = !filtro.status || ticket.status === filtro.status;
      const matchesDepartamento = !filtro.departamento || ticket.departamento === filtro.departamento;
      const matchesPrioridade = !filtro.prioridade || ticket.prioridade === filtro.prioridade;
      
      const dataInicio = filtro.dataInicio ? new Date(filtro.dataInicio) : null;
      const dataFim = filtro.dataFim ? new Date(filtro.dataFim) : null;
      const dataChamado = new Date(ticket.criadoEm);
      
      const matchesData = (!dataInicio || dataChamado >= dataInicio) && 
                         (!dataFim || dataChamado <= dataFim);

      return matchesSearch && matchesStatus && matchesDepartamento && 
             matchesPrioridade && matchesData;
    });

  const chamadosOrdenados = ordenarChamados(chamadosFiltrados);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Cabeçalho e Barra de Pesquisa */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Meus Chamados</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                title="Filtros avançados"
              >
                <Filter className="w-5 h-5" />
              </button>
              <button
                onClick={limparFiltros}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                title="Limpar filtros"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar chamados..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filtro.status}
                    onChange={(e) => setFiltro({ ...filtro, status: e.target.value })}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Todos</option>
                    <option value="aberto">Aberto</option>
                    <option value="em_atendimento">Em Atendimento</option>
                    <option value="resolvido">Resolvido</option>
                    <option value="fechado">Fechado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departamento
                  </label>
                  <select
                    value={filtro.departamento}
                    onChange={(e) => setFiltro({ ...filtro, departamento: e.target.value })}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Todos</option>
                    <option value="TI">TI</option>
                    <option value="Televendas">Televendas</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="Prevenção de Perdas">Prevenção de Perdas</option>
                    <option value="Departamento Pessoal">Departamento Pessoal</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridade
                  </label>
                  <select
                    value={filtro.prioridade}
                    onChange={(e) => setFiltro({ ...filtro, prioridade: e.target.value })}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Todas</option>
                    <option value="alta">Alta</option>
                    <option value="media">Média</option>
                    <option value="baixa">Baixa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Início
                  </label>
                  <input
                    type="date"
                    value={filtro.dataInicio}
                    onChange={(e) => setFiltro({ ...filtro, dataInicio: e.target.value })}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Fim
                  </label>
                  <input
                    type="date"
                    value={filtro.dataFim}
                    onChange={(e) => setFiltro({ ...filtro, dataFim: e.target.value })}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordenar por
                  </label>
                  <select
                    value={`${ordenacao.campo}-${ordenacao.ordem}`}
                    onChange={(e) => {
                      const [campo, ordem] = e.target.value.split('-');
                      setOrdenacao({ campo, ordem });
                    }}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="criadoEm-desc">Data de criação (mais recente)</option>
                    <option value="criadoEm-asc">Data de criação (mais antiga)</option>
                    <option value="prioridade-desc">Prioridade (maior)</option>
                    <option value="prioridade-asc">Prioridade (menor)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lista de Chamados */}
        <div className="divide-y">
          {chamadosOrdenados.map((ticket) => (
            <div
              key={ticket.id}
              className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
            >
              <div
                className="p-4 cursor-pointer"
                onClick={() => toggleTicket(ticket.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {ticket.titulo}
                      </h3>
                      <div className={`flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        <span className="mr-1">{getStatusIcon(ticket.status)}</span>
                        {ticket.status.replace('_', ' ').charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.prioridade)}`}>
                        {ticket.prioridade.charAt(0).toUpperCase() + ticket.prioridade.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 mr-1" />
                        {ticket.departamento}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(ticket.criadoEm).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {ticket.mensagens.length} mensagens
                      </div>
                    </div>
                  </div>
                  {expandedTicket === ticket.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </div>
              </div>

              {expandedTicket === ticket.id && (
                <div className="px-4 pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="bg-gray-50 rounded-lg p-4 flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Descrição:</h4>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">{ticket.descricao}</p>
                    </div>
                    {ticket.status !== 'resolvido' && ticket.status !== 'fechado' && (
                      <button
                        onClick={() => handleFinishTicket(ticket.id)}
                        className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 h-fit"
                        title="Finalizar chamado"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Finalizar</span>
                      </button>
                    )}
                  </div>

                  {ticket.imagens && ticket.imagens.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Anexos do chamado:</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {ticket.imagens.map((imagem, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={imagem}
                              alt={`Anexo ${index + 1}`}
                              className="h-24 w-full object-cover rounded-md cursor-pointer transition-all duration-200 group-hover:brightness-75"
                              onClick={() => window.open(imagem, '_blank')}
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                className="bg-white/90 p-1 rounded-full"
                                onClick={() => window.open(imagem, '_blank')}
                              >
                                <Search className="w-4 h-4 text-gray-700" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-4 border-b">
                      <h4 className="text-sm font-medium text-gray-900">Conversação</h4>
                    </div>
                    
                    <div className="p-4">
                      <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
                        {ticket.mensagens.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.userId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                message.userId === currentUser?.id
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">{message.userName}</span>
                                <span className="text-xs opacity-70">
                                  {new Date(message.timestamp).toLocaleTimeString('pt-BR')}
                                </span>
                              </div>
                              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                              {message.attachments && message.attachments.length > 0 && (
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                  {message.attachments.map((attachment, index) => (
                                    attachment.type === 'image' ? (
                                      <div key={index} className="relative group">
                                        <img
                                          src={attachment.url}
                                          alt={`Anexo ${index + 1}`}
                                          className="rounded-md max-w-[200px] cursor-pointer transition-all duration-200 group-hover:brightness-75"
                                          onClick={() => window.open(attachment.url, '_blank')}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button
                                            className="bg-white/90 p-1 rounded-full"
                                            onClick={() => window.open(attachment.url, '_blank')}
                                          >
                                            <Search className="w-4 h-4 text-gray-700" />
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <video
                                        key={index}
                                        src={attachment.url}
                                        controls
                                        className="rounded-md max-w-[200px]"
                                      />
                                    )
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        <div ref={messageEndRef} />
                      </div>

                      <div className="flex items-end space-x-2">
                        <div className="flex-1">
                          <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Digite sua mensagem..."
                            rows={2}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                            title="Anexar arquivo"
                          >
                            <Paperclip className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleSendMessage(ticket.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                            title="Enviar mensagem"
                          >
                            <Send className="w-4 h-4" />
                            <span>Enviar</span>
                          </button>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/*,video/*"
                          className="hidden"
                          onChange={(e) => handleAttachment(ticket.id, e)}
                        />
                      </div>

                      {attachments[ticket.id]?.length > 0 && (
                        <div className="mt-2">
                          <div className="text-sm text-gray-500 mb-1">
                            Anexos selecionados:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {attachments[ticket.id].map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center text-xs bg-gray-100 rounded px-2 py-1"
                              >
                                <span className="truncate max-w-[150px]">{file.name}</span>
                                <button
                                  onClick={() => {
                                    setAttachments(prev => ({
                                      ...prev,
                                      [ticket.id]: prev[ticket.id].filter((_, i) => i !== index)
                                    }));
                                  }}
                                  className="ml-2 text-red-500 hover:text-red-700"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {chamadosOrdenados.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum chamado encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                Não existem chamados que correspondam aos critérios de busca.
              </p>
              <button
                onClick={limparFiltros}
                className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}