import React, { useState, useRef, useEffect } from 'react';
import { Ticket, Message, TicketStatus } from '../types/ticket';
import { User } from '../types/user';
import { 
  ArrowLeft,
  MessageSquare,
  Paperclip,
  Send,
  CheckCircle,
  Clock,
  Calendar,
  Building2,
  User as UserIcon,
  X,
  Image as ImageIcon,
  Search
} from 'lucide-react';

interface TicketResponseProps {
  tickets: Ticket[];
  currentUser: User | null;
  onBack: () => void;
  onUpdateTickets: (tickets: Ticket[]) => void;
}

export function TicketResponse({ tickets, currentUser, onBack, onUpdateTickets }: TicketResponseProps) {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState<string>('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtros, setFiltros] = useState({
    prioridade: '',
    status: 'em_atendimento',
    dataInicio: '',
    dataFim: ''
  });

  const messageEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedTicket?.mensagens]);

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade.toLowerCase()) {
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

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = !filtros.prioridade || ticket.prioridade === filtros.prioridade;
    const matchesStatus = !filtros.status || ticket.status === filtros.status;
    const dataTicket = new Date(ticket.criadoEm);
    const matchesDateRange = (!filtros.dataInicio || dataTicket >= new Date(filtros.dataInicio)) &&
                           (!filtros.dataFim || dataTicket <= new Date(filtros.dataFim));
    
    return matchesSearch && matchesPriority && matchesStatus && matchesDateRange;
  });

  const handleSendMessage = () => {
    if (!selectedTicket || (!newMessage.trim() && attachments.length === 0)) return;

    const newMessageObj: Message = {
      id: crypto.randomUUID(),
      userId: currentUser?.id || '',
      userName: currentUser?.nome || '',
      content: newMessage.trim(),
      timestamp: new Date(),
      attachments: attachments.map(file => ({
        type: file.type.startsWith('image/') ? 'image' : 'video',
        url: URL.createObjectURL(file)
      }))
    };

    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === selectedTicket.id) {
        return {
          ...ticket,
          mensagens: [...ticket.mensagens, newMessageObj],
          atualizadoEm: new Date()
        };
      }
      return ticket;
    });

    onUpdateTickets(updatedTickets);
    setNewMessage('');
    setAttachments([]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return (isImage || isVideo) && isValidSize;
    });

    setAttachments(prev => [...prev, ...validFiles]);
  };

  const handleFinishTicket = () => {
    if (!selectedTicket) return;

    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === selectedTicket.id) {
        return {
          ...ticket,
          status: 'resolvido' as TicketStatus,
          atualizadoEm: new Date()
        };
      }
      return ticket;
    });

    onUpdateTickets(updatedTickets);
    setSelectedTicket(null);
  };

  return (
    <div className="h-full flex">
      {/* Sidebar com lista de chamados */}
      <div className="w-1/3 border-r bg-gray-50 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Chamados</h2>
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar chamados..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <select
              value={filtros.prioridade}
              onChange={(e) => setFiltros(prev => ({ ...prev, prioridade: e.target.value }))}
              className="rounded-lg border-gray-300 text-sm"
            >
              <option value="">Todas Prioridades</option>
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </select>

            <select
              value={filtros.status}
              onChange={(e) => setFiltros(prev => ({ ...prev, status: e.target.value }))}
              className="rounded-lg border-gray-300 text-sm"
            >
              <option value="em_atendimento">Em Atendimento</option>
              <option value="aberto">Aberto</option>
              <option value="resolvido">Resolvido</option>
              <option value="fechado">Fechado</option>
            </select>
          </div>

          <div className="space-y-2">
            {filteredTickets.map(ticket => (
              <button
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedTicket?.id === ticket.id
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                } border`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 line-clamp-1">{ticket.titulo}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(ticket.prioridade)}`}>
                    {ticket.prioridade.charAt(0).toUpperCase() + ticket.prioridade.slice(1)}
                  </span>
                </div>
                <div className="text-sm text-gray-500 flex items-center space-x-3">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(ticket.criadoEm).toLocaleDateString('pt-BR')}
                  </span>
                  <span className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    {ticket.mensagens.length}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Área principal de visualização/resposta */}
      {selectedTicket ? (
        <div className="flex-1 flex flex-col h-full bg-white">
          <div className="border-b p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-gray-900">{selectedTicket.titulo}</h2>
              <button
                onClick={handleFinishTicket}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Finalizar Chamado
              </button>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Building2 className="w-4 h-4 mr-1" />
                {selectedTicket.departamento}
              </span>
              <span className="flex items-center">
                <UserIcon className="w-4 h-4 mr-1" />
                {selectedTicket.criadoPorNome}
              </span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(selectedTicket.criadoEm).toLocaleDateString('pt-BR')}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedTicket.status)}`}>
                {selectedTicket.status.replace('_', ' ').charAt(0).toUpperCase() + selectedTicket.status.slice(1)}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-medium text-gray-900 mb-2">Descrição:</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{selectedTicket.descricao}</p>
              </div>

              {selectedTicket.imagens && selectedTicket.imagens.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Anexos do chamado:</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {selectedTicket.imagens.map((imagem, index) => (
                      <img
                        key={index}
                        src={imagem}
                        alt={`Anexo ${index + 1}`}
                        className="h-24 w-full object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                        onClick={() => window.open(imagem, '_blank')}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {selectedTicket.mensagens.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.userId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-4 ${
                        message.userId === currentUser?.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-white shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{message.userName}</span>
                        <span className="text-xs opacity-75">
                          {new Date(message.timestamp).toLocaleTimeString('pt-BR')}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          {message.attachments.map((attachment, index) => (
                            attachment.type === 'image' ? (
                              <img
                                key={index}
                                src={attachment.url}
                                alt={`Anexo ${index + 1}`}
                                className="rounded-lg max-w-[200px] cursor-pointer hover:opacity-75 transition-opacity"
                                onClick={() => window.open(attachment.url, '_blank')}
                              />
                            ) : (
                              <video
                                key={index}
                                src={attachment.url}
                                controls
                                className="rounded-lg max-w-[200px]"
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
            </div>
          </div>

          <div className="border-t p-4 bg-white">
            <div className="max-w-3xl mx-auto">
              {attachments.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-100 rounded-lg px-3 py-1 text-sm"
                    >
                      <ImageIcon className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="truncate max-w-[150px]">{file.name}</span>
                      <button
                        onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                    title="Anexar arquivo"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione um chamado</h3>
            <p className="text-gray-500">
              Escolha um chamado da lista para visualizar e responder
            </p>
          </div>
        </div>
      )}
    </div>
  );
}