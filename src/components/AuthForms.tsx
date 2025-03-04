import React, { useState } from 'react';
import { User } from '../types/user';
import { LogIn, Mail } from 'lucide-react';

interface AuthFormsProps {
  onLogin: (email: string, password: string) => void;
  onForgotPassword: (email: string) => void;
}

export function AuthForms({ onLogin, onForgotPassword }: AuthFormsProps) {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  // Estado do formulário de login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Estado do formulário de recuperação de senha
  const [forgotEmail, setForgotEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(loginEmail, loginPassword);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    onForgotPassword(forgotEmail);
    setShowForgotPassword(false);
  };

  if (showForgotPassword) {
    return (
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <Mail className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recuperar Senha</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Digite seu e-mail para receber as instruções
          </p>
        </div>
        
        <form onSubmit={handleForgotPassword} className="space-y-6">
          <div>
            <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              E-mail
            </label>
            <input
              type="email"
              id="forgot-email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Voltar ao login
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Enviar instruções
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="text-center mb-8">
        <LogIn className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Login</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Acesse sua conta para gerenciar seus chamados
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            E-mail
          </label>
          <input
            type="email"
            id="login-email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Senha
          </label>
          <input
            type="password"
            id="login-password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            Esqueceu a senha?
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Entrar
          </button>
        </div>
      </form>
    </div>
  );
}