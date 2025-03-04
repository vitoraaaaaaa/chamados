import React, { useState } from 'react';
import { Ticket } from '../types/ticket';
import { ArrowLeft, FileText, Download, BarChart2, PieChart } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ReportsPanelProps {
  tickets: Ticket[];
  onBack: () => void;
}

export function ReportsPanel({ tickets, onBack }: ReportsPanelProps) {
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Filtrar tickets pelo intervalo de datas
  const filteredTickets = tickets.filter(ticket => {
    const ticketDate = new Date(ticket.criadoEm);
    const startDate = dateRange.startDate ? new Date(dateRange.startDate) : null;
    const endDate = dateRange.endDate ? new Date(dateRange.endDate) : null;
    
    if (startDate && endDate) {
      return ticketDate >= startDate && ticketDate <= endDate;
    } else if (startDate) {
      return ticketDate >= startDate;
    } else if (endDate) {
      return ticketDate <= endDate;
    }
    
    return true;
  });

  // Agrupar tickets por departamento
  const ticketsByDepartment = filteredTickets.reduce((acc, ticket) => {
    const dept = ticket.departamento;
    if (!acc[dept]) {
      acc[dept] = [];
    }
    acc[dept].push(ticket);
    return acc;
  }, {} as Record<string, Ticket[]>);

  // Agrupar tickets por problema (usando o título como identificador)
  const ticketsByProblem = filteredTickets.reduce((acc, ticket) => {
    const problem = ticket.titulo;
    if (!acc[problem]) {
      acc[problem] = 0;
    }
    acc[problem]++;
    return acc;
  }, {} as Record<string, number>);

  // Ordenar problemas por frequência (do mais frequente para o menos frequente)
  const sortedProblems = Object.entries(ticketsByProblem)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10); // Top 10 problemas mais frequentes

  // Exportar para Excel
  const exportToExcel = () => {
    // Dados para a planilha de departamentos
    const departmentData = Object.entries(ticketsByDepartment).map(([department, deptTickets]) => ({
      Departamento: department,
      'Total de Chamados': deptTickets.length,
      'Chamados Abertos': deptTickets.filter(t => t.status === 'aberto').length,
      'Chamados em Atendimento': deptTickets.filter(t => t.status === 'em_atendimento').length,
      'Chamados Resolvidos': deptTickets.filter(t => t.status === 'resolvido').length,
      'Chamados Fechados': deptTickets.filter(t => t.status === 'fechado').length
    }));

    // Dados para a planilha de problemas frequentes
    const problemData = sortedProblems.map(([problem, count]) => ({
      Problema: problem,
      Ocorrências: count
    }));

    // Criar workbook com múltiplas planilhas
    const wb = XLSX.utils.book_new();
    
    // Adicionar planilha de departamentos
    const deptWs = XLSX.utils.json_to_sheet(departmentData);
    XLSX.utils.book_append_sheet(wb, deptWs, "Chamados por Departamento");
    
    // Adicionar planilha de problemas frequentes
    const problemWs = XLSX.utils.json_to_sheet(problemData);
    XLSX.utils.book_append_sheet(wb, problemWs, "Problemas Frequentes");
    
    // Gerar nome do arquivo com data atual
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `relatorio_chamados_${dateStr}.xlsx`;
    
    // Exportar arquivo
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Relatórios</h2>
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar ao Menu
        </button>
      </div>

      {/* Filtros de data */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filtrar por período</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
              Data inicial
            </label>
            <input
              type="date"
              id="start-date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
              Data final
            </label>
            <input
              type="date"
              id="end-date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={exportToExcel}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar para Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chamados por departamento */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Chamados por Departamento</h3>
            <BarChart2 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Departamento
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Abertos
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Em Atendimento
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resolvidos
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(ticketsByDepartment).map(([department, deptTickets]) => (
                  <tr key={department}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {deptTickets.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {deptTickets.filter(t => t.status === 'aberto').length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {deptTickets.filter(t => t.status === 'em_atendimento').length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {deptTickets.filter(t => t.status === 'resolvido').length}
                    </td>
                  </tr>
                ))}
                {Object.keys(ticketsByDepartment).length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      Nenhum chamado encontrado no período selecionado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Problemas mais frequentes */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Problemas Mais Frequentes</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Problema
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ocorrências
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedProblems.map(([problem, count]) => (
                  <tr key={problem}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {problem}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {count}
                    </td>
                  </tr>
                ))}
                {sortedProblems.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      Nenhum chamado encontrado no período selecionado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}