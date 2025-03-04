import React, { useState, useRef } from 'react';
import { 
  Upload, 
  X, 
  Building2,
  AlertTriangle,
  Clock,
  Info
} from 'lucide-react';
import { Ticket, TicketPriority, TicketStatus, Department } from '../types/ticket';

interface NewTicketFormProps {
  onSubmit: (ticket: Omit<Ticket, 'id' | 'criadoEm' | 'atualizadoEm' | 'criadoPor' | 'atribuidoPara'>) => void;
  onCancel?: () => void;
}

export function NewTicketForm({ onSubmit, onCancel }: NewTicketFormProps) {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    prioridade: 'media' as TicketPriority,
    departamento: 'TI' as Department,
    imagens: [] as string[],
    status: 'aberto' as TicketStatus,
    mensagens: []
  });
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case 'alta':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'media':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'baixa':
        return 'bg-green-50 border-green-200 text-green-700';
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isImage && isValidSize;
    });

    const newImages = validFiles.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      imagens: [...prev.imagens, ...newImages]
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imagens: prev.imagens.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    
    // Reset form
    setFormData({
      titulo: '',
      descricao: '',
      prioridade: 'media',
      departamento: 'TI',
      imagens: [],
      status: 'aberto',
      mensagens: []
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Abrir Novo Chamado</h2>
            <p className="mt-1 text-sm text-gray-500">
              Preencha as informações abaixo para criar um novo chamado
            </p>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título do Chamado
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ex: Problema com impressora"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição Detalhada
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                rows={4}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Descreva o problema em detalhes..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Setor Responsável
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <select
                    value={formData.departamento}
                    onChange={(e) => setFormData(prev => ({ ...prev, departamento: e.target.value as Department }))}
                    className="w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="TI">TI</option>
                    <option value="Televendas">Televendas</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="Prevenção de Perdas">Prevenção de Perdas</option>
                    <option value="Departamento Pessoal">Departamento Pessoal</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prioridade
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['baixa', 'media', 'alta'] as const).map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, prioridade: priority }))}
                      className={`
                        flex items-center justify-center px-3 py-2 border rounded-lg text-sm font-medium
                        ${formData.prioridade === priority ? getPriorityColor(priority) : 'bg-white border-gray-300 text-gray-700'}
                        hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                      `}
                    >
                      {priority === 'alta' && <AlertTriangle className="w-4 h-4 mr-1" />}
                      {priority === 'media' && <Clock className="w-4 h-4 mr-1" />}
                      {priority === 'baixa' && <Info className="w-4 h-4 mr-1" />}
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Anexos
              </label>
              <div
                className={`
                  mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg
                  ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
                  ${formData.imagens.length > 0 ? 'border-solid' : 'border-dashed'}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Faça upload de imagens</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">ou arraste e solte</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG até 10MB
                  </p>
                </div>
              </div>

              {formData.imagens.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {formData.imagens.map((imagem, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imagem}
                        alt={`Anexo ${index + 1}`}
                        className="h-24 w-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Criar Chamado
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}