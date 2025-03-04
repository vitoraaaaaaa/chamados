export type UserRole = 'admin' | 'usuario';
export type Department = 'TI' | 'Televendas' | 'Financeiro' | 'Prevenção de Perdas' | 'Departamento Pessoal' | 'Comercial' | 'Marketing';

export interface User {
  id: string;
  nome: string;
  cargo: UserRole;
  departamento: Department;
  email: string;
  telefone: string;
}

export interface AuthState {
  usuario: User | null;
  autenticado: boolean;
}