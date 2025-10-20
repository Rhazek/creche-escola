'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AuthGuard from '@/components/AuthGuard';
import RoleGuard from '@/components/RoleGuard';
import { useAuth } from '@/hooks/useAuth';
import { PageHeader, Container } from '@/components/layout/LayoutWrapper';

interface EnrollmentData {
  id: string;
  nomeCompleto: string;
  dataNascimento: string;
  cpf: string;
  nomeResponsavel: string;
  telefone: string;
  email: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  racaCor: string;
  faixaRenda: string;
  numeroPessoasFamilia: string;
  situacaoHabitacional: string;
  possuiDeficiencia: string;
  tipoDeficiencia?: string;
  dataCadastro: any;
  status: string;
  anoLetivo?: string;
}

export default function RematriculasPage() {
  const { userProfile } = useAuth();
  const [enrollments, setEnrollments] = useState<EnrollmentData[]>([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState<EnrollmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  // Filtros
  const [filters, setFilters] = useState({
    nome: '',
    cpf: '',
    status: 'aprovada'
  });

  useEffect(() => {
    loadEnrollments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [enrollments, filters]);

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      
      // Carregar todas as matrículas e filtrar no cliente
      const q = query(collection(db, 'matriculas'));
      const querySnapshot = await getDocs(q);
      const allData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as EnrollmentData[];
      
      // Filtrar apenas matrículas aprovadas no cliente
      const approvedEnrollments = allData.filter(enrollment => 
        enrollment.status === 'aprovada'
      );
      
      setEnrollments(approvedEnrollments);
    } catch (error: any) {
      setError('Erro ao carregar matrículas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...enrollments];

    // Filtro por nome
    if (filters.nome) {
      filtered = filtered.filter(enrollment => 
        enrollment.nomeCompleto.toLowerCase().includes(filters.nome.toLowerCase())
      );
    }

    // Filtro por CPF
    if (filters.cpf) {
      filtered = filtered.filter(enrollment => 
        enrollment.cpf.includes(filters.cpf)
      );
    }

    // Filtro por status
    if (filters.status) {
      filtered = filtered.filter(enrollment => enrollment.status === filters.status);
    }

    setFilteredEnrollments(filtered);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReenrollment = async (enrollmentId: string) => {
    try {
      setError('');
      setSuccess('');

      // Atualizar status para rematrícula
      await updateDoc(doc(db, 'matriculas', enrollmentId), {
        status: 'rematriculada',
        anoLetivo: selectedYear,
        dataRematricula: new Date(),
        rematriculadoPor: userProfile?.nomeCompleto || userProfile?.email
      });

      setSuccess('Rematrícula realizada com sucesso!');
      
      // Recarregar dados
      await loadEnrollments();
    } catch (error: any) {
      setError('Erro ao realizar rematrícula: ' + error.message);
    }
  };

  const clearFilters = () => {
    setFilters({
      nome: '',
      cpf: '',
      status: 'aprovada'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'pendente': 'bg-yellow-100 text-yellow-800',
      'aprovada': 'bg-green-100 text-green-800',
      'rejeitada': 'bg-red-100 text-red-800',
      'em_analise': 'bg-blue-100 text-blue-800',
      'rematriculada': 'bg-purple-100 text-purple-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <AuthGuard>
        <RoleGuard allowedRoles={['funcionario', 'administrador']}>
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-center items-center h-64">
                <div className="text-lg text-gray-600">Carregando matrículas...</div>
              </div>
            </div>
          </div>
        </RoleGuard>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['funcionario', 'administrador']}>
        <Container>
          <PageHeader
            title="Sistema de Rematrículas"
            subtitle={`Gerencie as rematrículas dos alunos para o ano letivo ${selectedYear}`}
          />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-600">{success}</p>
              </div>
            )}

            {/* Configuração do Ano Letivo */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Configurações</h2>
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ano Letivo</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Filtros</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Aluno</label>
                  <input
                    type="text"
                    value={filters.nome}
                    onChange={(e) => handleFilterChange('nome', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Digite o nome..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                  <input
                    type="text"
                    value={filters.cpf}
                    onChange={(e) => handleFilterChange('cpf', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="000.000.000-00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="aprovada">Aprovadas</option>
                    <option value="rematriculada">Rematriculadas</option>
                    <option value="">Todas</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-4 mt-4">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="text-2xl font-bold text-primary-600">{enrollments.length}</div>
                <div className="text-sm text-gray-600">Total de Matrículas Aprovadas</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="text-2xl font-bold text-green-600">
                  {enrollments.filter(e => e.status === 'rematriculada').length}
                </div>
                <div className="text-sm text-gray-600">Rematriculadas</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="text-2xl font-bold text-yellow-600">
                  {enrollments.filter(e => e.status === 'aprovada').length}
                </div>
                <div className="text-sm text-gray-600">Pendentes de Rematrícula</div>
              </div>
            </div>

            {/* Lista de Matrículas */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">
                  Matrículas ({filteredEnrollments.length} de {enrollments.length})
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aluno
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Responsável
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contato
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEnrollments.map((enrollment) => (
                      <tr key={enrollment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {enrollment.nomeCompleto}
                          </div>
                          <div className="text-sm text-gray-500">
                            {enrollment.cpf}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {enrollment.nomeResponsavel}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {enrollment.telefone}
                          </div>
                          {enrollment.email && (
                            <div className="text-sm text-gray-500">
                              {enrollment.email}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(enrollment.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {enrollment.status === 'aprovada' && (
                            <button
                              onClick={() => handleReenrollment(enrollment.id)}
                              className="text-primary-600 hover:text-primary-900 bg-primary-50 hover:bg-primary-100 px-3 py-1 rounded-md"
                            >
                              Rematricular
                            </button>
                          )}
                          {enrollment.status === 'rematriculada' && (
                            <span className="text-green-600 text-sm">Rematriculada</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredEnrollments.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhuma matrícula encontrada com os filtros aplicados.</p>
                </div>
              )}
            </div>
        </Container>
      </RoleGuard>
    </AuthGuard>
  );
}

