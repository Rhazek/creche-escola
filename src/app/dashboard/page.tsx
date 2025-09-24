'use client';

import AuthGuard from '@/components/AuthGuard';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Dashboard - Creche-Escola
          </h1>
          
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-primary-800 mb-2">
              Bem-vindo(a)!
            </h2>
            <p className="text-primary-700">
              <strong>Email:</strong> {user?.email}
            </p>
            <p className="text-primary-700 text-sm mt-2">
              <strong>Último acesso:</strong> {new Date().toLocaleString('pt-BR')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                📚 Matrículas
              </h3>
              <p className="text-blue-600 text-sm">
                Gerencie as matrículas dos alunos
              </p>
              <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                Ver Matrículas
              </button>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                👥 Alunos
              </h3>
              <p className="text-green-600 text-sm">
                Cadastro e consulta de alunos
              </p>
              <button className="mt-3 bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
                Ver Alunos
              </button>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">
                📊 Relatórios
              </h3>
              <p className="text-purple-600 text-sm">
                Relatórios e estatísticas
              </p>
              <button className="mt-3 bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700">
                Ver Relatórios
              </button>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-orange-800 mb-2">
                ⚙️ Configurações
              </h3>
              <p className="text-orange-600 text-sm">
                Configurações do sistema
              </p>
              <button className="mt-3 bg-orange-600 text-white px-4 py-2 rounded text-sm hover:bg-orange-700">
                Configurar
              </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                👨‍👩‍👧‍👦 Responsáveis
              </h3>
              <p className="text-red-600 text-sm">
                Cadastro de pais/responsáveis
              </p>
              <button className="mt-3 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700">
                Ver Responsáveis
              </button>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-indigo-800 mb-2">
                📋 Documentos
              </h3>
              <p className="text-indigo-600 text-sm">
                Gerenciar documentos
              </p>
              <button className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700">
                Ver Documentos
              </button>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              📈 Status do Sistema
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">✅</div>
                <p className="text-gray-600">Sistema Online</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">🔒</div>
                <p className="text-gray-600">Autenticado</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">⚡</div>
                <p className="text-gray-600">Conexão Ativa</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}