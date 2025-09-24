'use client';

import { useAuth } from '../hooks/useAuth';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Sistema de Gestão - Creche-Escola
      </h1>
      
      <p className="text-lg text-gray-600 mb-8">
        Bem-vindo ao sistema de gestão de matrículas da nossa creche-escola pública.
      </p>

      {user ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">Você está logado como: {user.email}</p>
          <Link
            href="/dashboard"
            className="inline-block mt-2 bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
          >
            Ir para Dashboard
          </Link>
        </div>
      ) : (
        <div className="space-x-4">
          <Link
            href="/login"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
          >
            Fazer Login
          </Link>
          <Link
            href="/signup"
            className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300"
          >
            Criar Conta
          </Link>
        </div>
      )}
      
      <div className="mt-12 grid md:grid-cols-3 gap-8 text-left">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3 text-primary-600">Gestão de Matrículas</h3>
          <p className="text-gray-600">
            Sistema completo para gerenciar as matrículas dos alunos da creche-escola.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3 text-primary-600">Controle de Acesso</h3>
          <p className="text-gray-600">
            Autenticação segura para funcionários e administradores.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3 text-primary-600">Relatórios</h3>
          <p className="text-gray-600">
            Geração de relatórios detalhados sobre as matrículas e dados dos alunos.
          </p>
        </div>
      </div>
    </div>
  );
}