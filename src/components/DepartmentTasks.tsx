import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, Clock, AlertTriangle, Plus, Trash2, User, Calendar } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'baixa' | 'media' | 'alta';
  status: 'pendente' | 'em_andamento' | 'concluida';
  dueDate: string;
  assignedTo?: string;
  createdAt: Date;
}

interface DepartmentTasksProps {
  department: string;
  onBack: () => void;
}

interface Column {
  id: 'pendente' | 'em_andamento' | 'concluida';
  title: string;
  color: string;
  tasks: Task[];
}

export function DepartmentTasks({ department, onBack }: DepartmentTasksProps) {
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'media' as 'baixa' | 'media' | 'alta',
    dueDate: '',
    assignedTo: ''
  });

  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'pendente',
      title: 'Pendente',
      color: 'border-yellow-500',
      tasks: [
        {
          id: '1',
          title: 'Atualizar inventário de equipamentos',
          description: 'Realizar contagem física de todos os equipamentos do setor e atualizar planilha de controle',
          priority: 'media',
          status: 'pendente',
          dueDate: '2025-03-15',
          assignedTo: 'João Silva',
          createdAt: new Date('2025-03-01')
        }
      ]
    },
    {
      id: 'em_andamento',
      title: 'Em Andamento',
      color: 'border-blue-500',
      tasks: [
        {
          id: '2',
          title: 'Preparar relatório mensal',
          description: 'Compilar dados de desempenho do setor para apresentação na reunião gerencial',
          priority: 'alta',
          status: 'em_andamento',
          dueDate: '2025-03-10',
          assignedTo: 'Maria Santos',
          createdAt: new Date('2025-03-02')
        }
      ]
    },
    {
      id: 'concluida',
      title: 'Concluída',
      color: 'border-green-500',
      tasks: []
    }
  ]);

  const handleMoveTask = (taskId: string, sourceStatus: string, targetStatus: string) => {
    const sourceColumn = columns.find(col => col.id === sourceStatus);
    const targetColumn = columns.find(col => col.id === targetStatus);

    if (!sourceColumn || !targetColumn) return;

    const task = sourceColumn.tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedTask = { ...task, status: targetStatus as Task['status'] };

    setColumns(columns.map(col => {
      if (col.id === sourceStatus) {
        return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) };
      }
      if (col.id === targetStatus) {
        return { ...col, tasks: [updatedTask, ...col.tasks] };
      }
      return col;
    }));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTask.title || !newTask.dueDate) return;
    
    const task: Task = {
      id: crypto.randomUUID(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      status: 'pendente',
      dueDate: newTask.dueDate,
      assignedTo: newTask.assignedTo || undefined,
      createdAt: new Date()
    };
    
    setColumns(columns.map(col => 
      col.id === 'pendente' 
        ? { ...col, tasks: [task, ...col.tasks] }
        : col
    ));

    setNewTask({
      title: '',
      description: '',
      priority: 'media',
      dueDate: '',
      assignedTo: ''
    });
    setShowNewTaskForm(false);
  };

  const handleDeleteTask = (taskId: string, columnId: string) => {
    setColumns(columns.map(col => 
      col.id === columnId
        ? { ...col, tasks: col.tasks.filter(task => task.id !== taskId) }
        : col
    ));
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'alta':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertTriangle className="w-3 h-3 mr-1" />Alta
        </span>;
      case 'media':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />Média
        </span>;
      case 'baixa':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />Baixa
        </span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tarefas do Setor - {department}</h2>
          <p className="mt-1 text-sm text-gray-500">Clique nas setas para mover as tarefas entre as colunas</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowNewTaskForm(!showNewTaskForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Tarefa
          </button>
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar ao Menu
          </button>
        </div>
      </div>

      {showNewTaskForm && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Nova Tarefa</h3>
            <button
              onClick={() => setShowNewTaskForm(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Fechar</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleAddTask} className="space-y-4">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="task-title" className="block text-sm font-medium text-gray-700">
                  Título
                </label>
                <input
                  type="text"
                  id="task-title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="task-description" className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  id="task-description"
                  rows={3}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="task-priority" className="block text-sm font-medium text-gray-700">
                  Prioridade
                </label>
                <select
                  id="task-priority"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'baixa' | 'media' | 'alta' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="task-due-date" className="block text-sm font-medium text-gray-700">
                  Data de Entrega
                </label>
                <input
                  type="date"
                  id="task-due-date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="task-assigned" className="block text-sm font-medium text-gray-700">
                  Responsável
                </label>
                <input
                  type="text"
                  id="task-assigned"
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Nome do responsável"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowNewTaskForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Adicionar Tarefa
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div 
            key={column.id} 
            className={`bg-white rounded-lg p-4 border-t-4 ${column.color} shadow-sm`}
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center justify-between">
              {column.title}
              <span className="bg-gray-100 text-gray-700 text-sm py-1 px-3 rounded-full">
                {column.tasks.length}
              </span>
            </h3>
            <div className="space-y-3">
              {column.tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                    <div className="flex items-center space-x-2">
                      {column.id !== 'pendente' && (
                        <button
                          onClick={() => handleMoveTask(task.id, column.id, 'pendente')}
                          className="text-yellow-600 hover:text-yellow-800"
                          title="Mover para Pendente"
                        >
                          ←
                        </button>
                      )}
                      {column.id !== 'em_andamento' && (
                        <button
                          onClick={() => handleMoveTask(task.id, column.id, 'em_andamento')}
                          className="text-blue-600 hover:text-blue-800"
                          title="Mover para Em Andamento"
                        >
                          {column.id === 'pendente' ? '→' : '←'}
                        </button>
                      )}
                      {column.id !== 'concluida' && (
                        <button
                          onClick={() => handleMoveTask(task.id, column.id, 'concluida')}
                          className="text-green-600 hover:text-green-800"
                          title="Mover para Concluída"
                        >
                          →
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteTask(task.id, column.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Excluir tarefa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{task.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getPriorityBadge(task.priority)}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                    </div>
                    {task.assignedTo && (
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {task.assignedTo}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {column.tasks.length === 0 && (
                <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-md">
                  Nenhuma tarefa
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}