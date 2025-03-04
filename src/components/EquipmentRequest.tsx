import React, { useState } from 'react';
import { User } from '../types/user';
import { ArrowLeft, Send, Plus, Trash2, Calendar } from 'lucide-react';

interface EquipmentRequestProps {
  user: User | null;
  onBack: () => void;
}

interface EquipmentItem {
  id: string;
  name: string;
  location: string;
  quantity: number;
  justification: string;
}

type Priority = 'baixa' | 'media' | 'alta';

export function EquipmentRequest({ user, onBack }: EquipmentRequestProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [items, setItems] = useState<EquipmentItem[]>([]);
  const [newItem, setNewItem] = useState({
    name: '',
    location: '',
    quantity: 1,
    justification: ''
  });
  const [requestDetails, setRequestDetails] = useState({
    priority: 'media' as Priority,
    desiredDate: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleAddItem = () => {
    if (!newItem.name || !newItem.location || newItem.quantity < 1) return;

    setItems([
      ...items,
      {
        id: crypto.randomUUID(),
        ...newItem
      }
    ]);

    setNewItem({
      name: '',
      location: '',
      quantity: 1,
      justification: ''
    });
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) return;
    
    // TODO: Implement API call to submit equipment request
    console.log('Submitting equipment request:', {
      userId: user?.id,
      department: user?.departamento,
      items,
      ...requestDetails
    });
    
    setSubmitted(true);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === currentStep
                ? 'bg-blue-600 text-white'
                : step < currentStep
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step < currentStep ? '✓' : step}
          </div>
          {step < 2 && (
            <div
              className={`w-20 h-1 ${
                step < currentStep ? 'bg-green-500' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  if (submitted) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Solicitar Equipamentos</h2>
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar ao Menu
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <Send className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="mt-3 text-lg font-medium text-gray-900">Solicitação Enviada</h3>
          <p className="mt-2 text-sm text-gray-500">
            Sua solicitação de equipamentos foi enviada com sucesso. O departamento responsável irá analisar seu pedido.
          </p>
          <div className="mt-4">
            <button
              onClick={() => {
                setSubmitted(false);
                setItems([]);
                setCurrentStep(1);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Nova Solicitação
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Solicitar Equipamentos</h2>
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar ao Menu
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        {renderStepIndicator()}

        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Solicitante</label>
                  <div className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-50 rounded-md shadow-sm text-gray-700">
                    {user?.nome}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Departamento</label>
                  <div className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-50 rounded-md shadow-sm text-gray-700">
                    {user?.departamento}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Prioridade</label>
                <select
                  value={requestDetails.priority}
                  onChange={(e) => setRequestDetails(prev => ({ ...prev, priority: e.target.value as Priority }))}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Data Desejada</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="date"
                    value={requestDetails.desiredDate}
                    onChange={(e) => setRequestDetails(prev => ({ ...prev, desiredDate: e.target.value }))}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Adicionar Item</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Nome do Item</label>
                    <input
                      type="text"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                      placeholder="Nome do equipamento"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Localização do Equipamento</label>
                    <input
                      type="text"
                      value={newItem.location}
                      onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                      placeholder="Ex: Sala 101, Mesa 3, Setor Administrativo"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Quantidade</label>
                    <input
                      type="number"
                      min="1"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Justificativa</label>
                    <input
                      type="text"
                      value={newItem.justification}
                      onChange={(e) => setNewItem({ ...newItem, justification: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                      placeholder="Motivo da solicitação"
                    />
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Adicionar
                  </button>
                </div>
              </div>

              {items.length > 0 ? (
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Item</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Localização</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Quantidade</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Justificativa</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Ações</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {items.map((item) => (
                        <tr key={item.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{item.name}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.location}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.quantity}</td>
                          <td className="px-3 py-4 text-sm text-gray-500">{item.justification}</td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-md">
                  Nenhum item adicionado ainda.
                </div>
              )}

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Resumo da Solicitação</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>Total de itens: {items.length}</p>
                      <p>Prioridade: {requestDetails.priority.charAt(0).toUpperCase() + requestDetails.priority.slice(1)}</p>
                      <p>Data desejada: {new Date(requestDetails.desiredDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Voltar
              </button>
            )}
            {currentStep < 2 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Próximo
              </button>
            ) : (
              <button
                type="submit"
                disabled={items.length === 0}
                className={`ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  items.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                }`}
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar Solicitação
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}