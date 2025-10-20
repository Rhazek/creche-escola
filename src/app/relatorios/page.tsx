'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AuthGuard from '@/components/AuthGuard';
import RoleGuard from '@/components/RoleGuard';
import { useDebounce } from '@/hooks/usePerformance';
import { SecurityUtils } from '@/lib/security';
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
}

export default function RelatoriosPage() {
  const [enrollments, setEnrollments] = useState<EnrollmentData[]>([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState<EnrollmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtros
  const [filters, setFilters] = useState({
    idadeMin: '',
    idadeMax: '',
    racaCor: '',
    faixaRenda: '',
    situacaoHabitacional: '',
    possuiDeficiencia: '',
    status: ''
  });

  // Debounce dos filtros para melhor performance
  const debouncedFilters = useDebounce(filters, 300);

  useEffect(() => {
    loadEnrollments();
  }, []);

  useEffect(() => {
    if (enrollments.length > 0) {
      applyFilters();
    }
  }, [enrollments, debouncedFilters]);

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Iniciando carregamento de matrículas...');
      
      // Tentar carregar do Firebase
      try {
        console.log('Tentando conectar ao Firebase...');
        const q = query(collection(db, 'matriculas'), orderBy('dataCadastro', 'desc'));
        const querySnapshot = await getDocs(q);
        const firebaseData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as EnrollmentData[];
        
        console.log('Dados carregados do Firebase:', firebaseData.length, 'registros');
        setEnrollments(firebaseData);
      } catch (firebaseError) {
        console.warn('Erro ao carregar do Firebase, tentando localStorage:', firebaseError);
        // Fallback: carregar do localStorage
        const localData = JSON.parse(localStorage.getItem('matriculas') || '[]');
        console.log('Dados carregados do localStorage:', localData.length, 'registros');
        setEnrollments(localData);
      }
    } catch (error: any) {
      console.error('Erro ao carregar matrículas:', error);
      setError('Erro ao carregar matrículas: ' + error.message);
    } finally {
      console.log('Finalizando carregamento...');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (!enrollments || enrollments.length === 0) return;
    
    let filtered = [...enrollments];

    // Filtro por idade
    if (debouncedFilters.idadeMin || debouncedFilters.idadeMax) {
      filtered = filtered.filter(enrollment => {
        const birthDate = new Date(enrollment.dataNascimento);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
        
        const minAge = debouncedFilters.idadeMin ? parseInt(debouncedFilters.idadeMin) : 0;
        const maxAge = debouncedFilters.idadeMax ? parseInt(debouncedFilters.idadeMax) : 6;
        
        return actualAge >= minAge && actualAge <= maxAge;
      });
    }

    // Filtro por raça/cor
    if (debouncedFilters.racaCor) {
      filtered = filtered.filter(enrollment => enrollment.racaCor === debouncedFilters.racaCor);
    }

    // Filtro por faixa de renda
    if (debouncedFilters.faixaRenda) {
      filtered = filtered.filter(enrollment => enrollment.faixaRenda === debouncedFilters.faixaRenda);
    }

    // Filtro por situação habitacional
    if (debouncedFilters.situacaoHabitacional) {
      filtered = filtered.filter(enrollment => enrollment.situacaoHabitacional === debouncedFilters.situacaoHabitacional);
    }

    // Filtro por deficiência
    if (debouncedFilters.possuiDeficiencia) {
      filtered = filtered.filter(enrollment => enrollment.possuiDeficiencia === debouncedFilters.possuiDeficiencia);
    }

    // Filtro por status
    if (debouncedFilters.status) {
      filtered = filtered.filter(enrollment => enrollment.status === debouncedFilters.status);
    }

    setFilteredEnrollments(filtered);
  };

  const handleFilterChange = (field: string, value: string) => {
    // Sanitizar entrada do usuário
    const sanitizedValue = SecurityUtils.sanitizeInput(value);
    
    setFilters(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));
  };

  const clearFilters = () => {
    setFilters({
      idadeMin: '',
      idadeMax: '',
      racaCor: '',
      faixaRenda: '',
      situacaoHabitacional: '',
      possuiDeficiencia: '',
      status: ''
    });
  };

  const refreshData = () => {
    loadEnrollments();
  };

  const exportToCSV = () => {
    const headers = [
      'Nome Completo',
      'Data de Nascimento',
      'Idade',
      'CPF',
      'Responsável',
      'Telefone',
      'Email',
      'Endereço',
      'Bairro',
      'Cidade',
      'Raça/Cor',
      'Faixa de Renda',
      'Pessoas na Família',
      'Situação Habitacional',
      'Possui Deficiência',
      'Tipo de Deficiência',
      'Data de Cadastro',
      'Status'
    ];

    const csvData = filteredEnrollments.map(enrollment => {
      const birthDate = new Date(enrollment.dataNascimento);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;

      return [
        enrollment.nomeCompleto,
        enrollment.dataNascimento,
        actualAge,
        enrollment.cpf,
        enrollment.nomeResponsavel,
        enrollment.telefone,
        enrollment.email || '',
        `${enrollment.endereco}, ${enrollment.numero}`,
        enrollment.bairro,
        enrollment.cidade,
        enrollment.racaCor,
        enrollment.faixaRenda,
        enrollment.numeroPessoasFamilia,
        enrollment.situacaoHabitacional,
        enrollment.possuiDeficiencia,
        enrollment.tipoDeficiencia || '',
        enrollment.dataCadastro?.toDate?.()?.toLocaleDateString('pt-BR') || enrollment.dataCadastro,
        enrollment.status
      ];
    });

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `matriculas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'pendente': 'bg-yellow-100 text-yellow-800',
      'aprovada': 'bg-green-100 text-green-800',
      'rejeitada': 'bg-red-100 text-red-800',
      'em_analise': 'bg-blue-100 text-blue-800'
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
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                <div className="text-lg text-gray-600">Carregando matrículas...</div>
                <div className="text-sm text-gray-500">Conectando ao Firebase...</div>
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
            title="Relatórios de Matrículas"
            subtitle="Visualize e filtre todas as matrículas cadastradas no sistema"
          />

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-600">{error}</p>
                    <button 
                      onClick={refreshData}
                      className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Tentar Novamente
                    </button>
                  </div>
                )}

                {!loading && !error && enrollments.length === 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-yellow-600">
                      Nenhuma matrícula encontrada. 
                      <a href="/matriculas" className="text-blue-600 hover:underline ml-1">
                        Clique aqui para cadastrar a primeira matrícula.
                      </a>
                    </p>
                  </div>
                )}

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filtros</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Idade Mínima</label>
              <input
                type="number"
                min="0"
                max="6"
                value={filters.idadeMin}
                onChange={(e) => handleFilterChange('idadeMin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Idade Máxima</label>
              <input
                type="number"
                min="0"
                max="6"
                value={filters.idadeMax}
                onChange={(e) => handleFilterChange('idadeMax', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Raça/Cor</label>
              <select
                value={filters.racaCor}
                onChange={(e) => handleFilterChange('racaCor', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Todas</option>
                <option value="branca">Branca</option>
                <option value="preta">Preta</option>
                <option value="parda">Parda</option>
                <option value="amarela">Amarela</option>
                <option value="indigena">Indígena</option>
                <option value="nao_informado">Não informado</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Faixa de Renda</label>
              <select
                value={filters.faixaRenda}
                onChange={(e) => handleFilterChange('faixaRenda', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Todas</option>
                <option value="ate_1_salario">Até 1 salário mínimo</option>
                <option value="1_a_2_salarios">1 a 2 salários mínimos</option>
                <option value="2_a_3_salarios">2 a 3 salários mínimos</option>
                <option value="3_a_5_salarios">3 a 5 salários mínimos</option>
                <option value="acima_5_salarios">Acima de 5 salários mínimos</option>
                <option value="nao_informado">Não informado</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Situação Habitacional</label>
              <select
                value={filters.situacaoHabitacional}
                onChange={(e) => handleFilterChange('situacaoHabitacional', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Todas</option>
                <option value="propria">Própria</option>
                <option value="alugada">Alugada</option>
                <option value="cedida">Cedida</option>
                <option value="financiada">Financiada</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Possui Deficiência</label>
              <select
                value={filters.possuiDeficiencia}
                onChange={(e) => handleFilterChange('possuiDeficiencia', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Todas</option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Todos</option>
                <option value="pendente">Pendente</option>
                <option value="aprovada">Aprovada</option>
                <option value="rejeitada">Rejeitada</option>
                <option value="em_analise">Em Análise</option>
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
            <button
              onClick={exportToCSV}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Exportar CSV ({filteredEnrollments.length} registros)
            </button>
            <button
              onClick={refreshData}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Atualizar Dados
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-primary-600">{enrollments.length}</div>
            <div className="text-sm text-gray-600">Total de Matrículas</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-green-600">
              {enrollments.filter(e => e.status === 'aprovada').length}
            </div>
            <div className="text-sm text-gray-600">Aprovadas</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {enrollments.filter(e => e.status === 'pendente').length}
            </div>
            <div className="text-sm text-gray-600">Pendentes</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-blue-600">
              {enrollments.filter(e => e.possuiDeficiencia === 'sim').length}
            </div>
            <div className="text-sm text-gray-600">Com Deficiência</div>
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
                    Idade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Responsável
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Raça/Cor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Renda
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEnrollments.map((enrollment) => {
                  const birthDate = new Date(enrollment.dataNascimento);
                  const today = new Date();
                  const age = today.getFullYear() - birthDate.getFullYear();
                  const monthDiff = today.getMonth() - birthDate.getMonth();
                  const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;

                  return (
                    <tr key={enrollment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {enrollment.nomeCompleto}
                        </div>
                        <div className="text-sm text-gray-500">
                          {enrollment.cpf}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {actualAge} anos
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {enrollment.racaCor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {enrollment.faixaRenda}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(enrollment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {enrollment.dataCadastro?.toDate?.()?.toLocaleDateString('pt-BR') || 
                         new Date(enrollment.dataCadastro).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  );
                })}
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

