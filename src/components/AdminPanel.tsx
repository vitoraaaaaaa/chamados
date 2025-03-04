import React, { useState } from 'react';
import { Department } from '../types/user';
import { 
  UserPlus, 
  ArrowLeft, 
  Users, 
  Search, 
  Filter,
  Trash2,
  Edit,
  Mail,
  Phone,
  Building2,
  Shield
} from 'lucide-react';

interface AdminPanelProps {
  onBack: () => void;
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'create'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<Department | ''>('');
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: 'user',
    department: 'TI' as Department,
    phone: '',
    password: ''
  });

  // Mock data for users list - replace with actual data from your backend
  const mockUsers = [
    {
      id: '1',
      nome: 'João Silva',
      email: 'joao@example.com',
      cargo: 'user',
      departamento: 'TI',
      telefone: '(11) 99999-9999'
    },
    {
      id: '2',
      nome: 'Maria Santos',
      email: 'maria@example.com',
      cargo: 'user',
      departamento: 'Financeiro',
      telefone: '(11) 88888-8888'
    }
  ];

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement user creation with Supabase
    console.log('Creating user:', newUserData);
    setNewUserData({
      name: '',
      email: '',
      role: 'user',
      department: 'TI',
      phone: '',
      password: ''
    });
    setActiveTab('users');
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || user.departamento === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Área do Administrador</h2>
            <p className="mt-1 text-sm text-gray-500">Gerencie usuários e permissões do sistema</p>
          </div>
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar ao Menu
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <Users className="w-5 h-5 mr-2" />
              Lista de Usuários
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`${
                activeTab === 'create'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Novo Usuário
            </button>
          </nav>
        </div>

        {activeTab === 'users' ? (
          <div className="bg-white shadow rounded-lg">
            {/* Filters */}
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nome ou email..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value as Department)}
                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Todos os departamentos</option>
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
            </div>

            {/* Users List */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Departamento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cargo
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-xl font-medium text-gray-600">
                                {user.nome.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.nome}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="w-4 h-4 mr-1" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {user.telefone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Building2 className="w-4 h-4 mr-1" />
                          {user.departamento}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Shield className="w-4 h-4 mr-1" />
                          {user.cargo}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          title="Editar"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          title="Excluir"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum usuário encontrado</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Não existem usuários que correspondam aos critérios de busca.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <UserPlus className="w-5 h-5 mr-2" />
              Criar Novo Usuário
            </h2>
            <form onSubmit={handleCreateUser} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={newUserData.name}
                    onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Senha
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={newUserData.password}
                    onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={newUserData.phone}
                    onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    Departamento
                  </label>
                  <select
                    id="department"
                    value={newUserData.department}
                    onChange={(e) => setNewUserData({ ...newUserData, department: e.target.value as Department })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Cargo
                  </label>
                  <select
                    id="role"
                    value={newUserData.role}
                    onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="user">Usuário</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('users')}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Criar Usuário
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}