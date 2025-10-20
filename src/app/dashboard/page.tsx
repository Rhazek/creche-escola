'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AuthGuard from '@/components/AuthGuard';
import RoleGuard from '@/components/RoleGuard';
import { useAuth } from '@/hooks/useAuth';
import { PageHeader, Container } from '@/components/layout/LayoutWrapper';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Users, 
  UserCheck, 
  UserX, 
  RotateCcw, 
  Accessibility, 
  TrendingUp,
  Calendar,
  Clock,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardStats {
  totalMatriculas: number;
  matriculasPendentes: number;
  matriculasAprovadas: number;
  matriculasRejeitadas: number;
  rematriculas: number;
  alunosComDeficiencia: number;
}

export default function DashboardPage() {
  const { user, userProfile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalMatriculas: 0,
    matriculasPendentes: 0,
    matriculasAprovadas: 0,
    matriculasRejeitadas: 0,
    rematriculas: 0,
    alunosComDeficiencia: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      
      const q = query(collection(db, 'matriculas'), orderBy('dataCadastro', 'desc'));
      const querySnapshot = await getDocs(q);
      const matriculas = querySnapshot.docs.map(doc => doc.data());

      const totalMatriculas = matriculas.length;
      const matriculasPendentes = matriculas.filter(m => m.status === 'pendente').length;
      const matriculasAprovadas = matriculas.filter(m => m.status === 'aprovada').length;
      const matriculasRejeitadas = matriculas.filter(m => m.status === 'rejeitada').length;
      const rematriculas = matriculas.filter(m => m.status === 'rematriculada').length;
      const alunosComDeficiencia = matriculas.filter(m => m.possuiDeficiencia === 'sim').length;

      setStats({
        totalMatriculas,
        matriculasPendentes,
        matriculasAprovadas,
        matriculasRejeitadas,
        rematriculas,
        alunosComDeficiencia
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['funcionario', 'administrador']}>
        <Container>
          <PageHeader
            title="Dashboard"
            subtitle="Visão geral do sistema de gestão de matrículas"
            breadcrumbs={[
              { label: 'Dashboard' }
            ]}
          />

            {/* Card de boas-vindas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-primary-900 mb-2">
                        Bem-vindo(a), {userProfile?.nomeCompleto || user?.email}!
                      </h2>
                      <p className="text-primary-700 mb-4">
                        Aqui você pode acompanhar todas as atividades do sistema de matrículas
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-primary-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Último acesso: {new Date().toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{new Date().toLocaleTimeString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center">
                        <TrendingUp className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <Card className="hover:shadow-medium transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Total de Matrículas</p>
                        <p className="text-3xl font-bold text-primary-600">
                          {loading ? '...' : stats.totalMatriculas}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Card className="hover:shadow-medium transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Pendentes</p>
                        <p className="text-3xl font-bold text-warning-600">
                          {loading ? '...' : stats.matriculasPendentes}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center">
                        <Clock className="h-6 w-6 text-warning-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Card className="hover:shadow-medium transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Aprovadas</p>
                        <p className="text-3xl font-bold text-success-600">
                          {loading ? '...' : stats.matriculasAprovadas}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                        <UserCheck className="h-6 w-6 text-success-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Card className="hover:shadow-medium transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Rejeitadas</p>
                        <p className="text-3xl font-bold text-error-600">
                          {loading ? '...' : stats.matriculasRejeitadas}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-error-100 rounded-xl flex items-center justify-center">
                        <UserX className="h-6 w-6 text-error-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Card className="hover:shadow-medium transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Rematrículas</p>
                        <p className="text-3xl font-bold text-primary-600">
                          {loading ? '...' : stats.rematriculas}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                        <RotateCcw className="h-6 w-6 text-primary-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Card className="hover:shadow-medium transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Com Deficiência</p>
                        <p className="text-3xl font-bold text-primary-600">
                          {loading ? '...' : stats.alunosComDeficiencia}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                        <Accessibility className="h-6 w-6 text-primary-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Ações Rápidas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Card>
                <CardHeader
                  title="Ações Rápidas"
                  subtitle="Acesse as principais funcionalidades do sistema"
                />
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-auto p-6 flex-col space-y-3"
                      onClick={() => window.location.href = '/matriculas'}
                    >
                      <Users className="h-8 w-8 text-primary-600" />
                      <div className="text-center">
                        <p className="font-semibold">Nova Matrícula</p>
                        <p className="text-sm text-gray-600">Cadastrar aluno</p>
                      </div>
                      <ArrowRight className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="h-auto p-6 flex-col space-y-3"
                      onClick={() => window.location.href = '/rematriculas'}
                    >
                      <RotateCcw className="h-8 w-8 text-success-600" />
                      <div className="text-center">
                        <p className="font-semibold">Rematrículas</p>
                        <p className="text-sm text-gray-600">Gerenciar renovações</p>
                      </div>
                      <ArrowRight className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="h-auto p-6 flex-col space-y-3"
                      onClick={() => window.location.href = '/relatorios'}
                    >
                      <TrendingUp className="h-8 w-8 text-warning-600" />
                      <div className="text-center">
                        <p className="font-semibold">Relatórios</p>
                        <p className="text-sm text-gray-600">Ver estatísticas</p>
                      </div>
                      <ArrowRight className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="h-auto p-6 flex-col space-y-3"
                      onClick={() => alert('Funcionalidade em desenvolvimento!')}
                    >
                      <Calendar className="h-8 w-8 text-gray-600" />
                      <div className="text-center">
                        <p className="font-semibold">Configurações</p>
                        <p className="text-sm text-gray-600">Ajustar sistema</p>
                      </div>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
        </Container>
      </RoleGuard>
    </AuthGuard>
  );
}
