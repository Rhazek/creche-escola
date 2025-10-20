'use client'

import React, { useState, useEffect } from 'react'
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import AuthGuard from '@/components/AuthGuard'
import RoleGuard from '@/components/RoleGuard'
import { PageHeader, Container } from '@/components/layout/LayoutWrapper'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail,
  Calendar,
  Briefcase,
  UserCheck,
  UserX,
  Edit,
  Shield,
  UserCog
} from 'lucide-react'
import { motion } from 'framer-motion'

interface PendingUser {
  id: string
  uid: string
  nomeCompleto: string
  email: string
  cargo: string
  dataCadastro: any
  status: 'pending' | 'approved' | 'rejected'
}

interface ApprovedUser {
  id: string
  uid: string
  nomeCompleto: string
  email: string
  cargo: string
  perfil: 'funcionario' | 'administrador'
  dataCadastro: any
  dataAprovacao: any
  aprovadoPor: string
}

export default function UsersPage() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
  const [approvedUsers, setApprovedUsers] = useState<ApprovedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('🔍 Carregando todos os usuários...')
      
      // Carregar usuários pendentes
      const pendingSnapshot = await getDocs(collection(db, 'usuarios_pendentes'))
      console.log('📊 Usuários pendentes encontrados:', pendingSnapshot.docs.length)
      
      const pendingUsers = pendingSnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data
        }
      }) as PendingUser[]
      
      setPendingUsers(pendingUsers.filter(user => user.status === 'pending'))
      
      // Carregar usuários aprovados
      const approvedSnapshot = await getDocs(collection(db, 'usuarios'))
      console.log('📊 Usuários aprovados encontrados:', approvedSnapshot.docs.length)
      
      const approvedUsers = approvedSnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data
        }
      }) as ApprovedUser[]
      
      setApprovedUsers(approvedUsers)
      
      console.log('✅ Usuários carregados:', {
        pendentes: pendingUsers.filter(user => user.status === 'pending').length,
        aprovados: approvedUsers.length
      })
      
    } catch (error: any) {
      console.error('❌ Erro ao carregar usuários:', error)
      
      if (error.code === 'permission-denied') {
        setError('Erro de permissão: Verifique as regras do Firestore')
      } else if (error.code === 'unavailable') {
        setError('Firebase indisponível: Verifique sua conexão')
      } else {
        setError(`Erro ao carregar usuários: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const approveUser = async (userId: string, perfil: 'funcionario' | 'administrador') => {
    try {
      setProcessing(userId)
      setError('')
      console.log('🚀 Aprovando usuário:', userId, 'como', perfil)
      
      // Encontrar o usuário na lista
      const user = pendingUsers.find(u => u.id === userId)
      if (!user) {
        throw new Error('Usuário não encontrado na lista')
      }
      
      console.log('👤 Dados do usuário:', user)
      
      // Atualizar status na coleção usuarios_pendentes
      const userRef = doc(db, 'usuarios_pendentes', userId)
      console.log('📝 Atualizando documento:', userRef.path)
      
      await updateDoc(userRef, {
        status: 'approved',
        perfil: perfil,
        dataAprovacao: new Date(),
        aprovadoPor: 'admin' // TODO: Pegar do usuário logado
      })
      
      console.log('✅ Status atualizado na coleção usuarios_pendentes')

      // Criar documento na coleção usuarios (usuários aprovados)
      console.log('📄 Criando documento na coleção usuarios...')
      
      const approvedUserData = {
        uid: user.uid,
        nomeCompleto: user.nomeCompleto,
        email: user.email,
        cargo: user.cargo,
        perfil: perfil,
        dataCadastro: user.dataCadastro,
        dataAprovacao: new Date(),
        aprovadoPor: 'admin'
      }
      
      console.log('📋 Dados para usuário aprovado:', approvedUserData)
      
      // Usar o uid como ID do documento para facilitar a busca
      await setDoc(doc(db, 'usuarios', user.uid), approvedUserData)
      console.log('✅ Usuário adicionado à coleção usuarios com ID:', user.uid)

      // Remover da lista de pendentes
      setPendingUsers(prev => prev.filter(u => u.id !== userId))
      console.log('✅ Usuário removido da lista de pendentes')
      
      // Recarregar usuários aprovados
      await loadUsers()
      
      console.log('🎉 Usuário aprovado com sucesso!')
      
    } catch (error: any) {
      console.error('❌ Erro ao aprovar usuário:', error)
      
      if (error.code === 'permission-denied') {
        setError('Erro de permissão: Verifique as regras do Firestore')
      } else if (error.code === 'not-found') {
        setError('Documento não encontrado no Firestore')
      } else if (error.message.includes('Usuário não encontrado')) {
        setError('Usuário não encontrado na lista')
      } else {
        setError(`Erro ao aprovar usuário: ${error.message}`)
      }
    } finally {
      setProcessing(null)
    }
  }

  const updateUserPermission = async (userId: string, newPerfil: 'funcionario' | 'administrador') => {
    try {
      setProcessing(userId)
      setError('')
      console.log('🔄 Atualizando permissão do usuário:', userId, 'para', newPerfil)
      
      // Atualizar na coleção usuarios
      const userRef = doc(db, 'usuarios', userId)
      await updateDoc(userRef, {
        perfil: newPerfil,
        dataAprovacao: new Date(),
        aprovadoPor: 'admin'
      })
      
      console.log('✅ Permissão atualizada na coleção usuarios')
      
      // Atualizar na lista local
      setApprovedUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, perfil: newPerfil } : user
      ))
      
      console.log('🎉 Permissão atualizada com sucesso!')
      
    } catch (error: any) {
      console.error('❌ Erro ao atualizar permissão:', error)
      setError(`Erro ao atualizar permissão: ${error.message}`)
    } finally {
      setProcessing(null)
    }
  }

  const rejectUser = async (userId: string) => {
    try {
      setProcessing(userId)
      
      const userRef = doc(db, 'usuarios_pendentes', userId)
      await updateDoc(userRef, {
        status: 'rejected',
        dataAprovacao: new Date(),
        aprovadoPor: 'admin'
      })

      // Remover da lista de pendentes
      setPendingUsers(prev => prev.filter(u => u.id !== userId))
      
      // Recarregar dados
      await loadUsers()
      
    } catch (error) {
      console.error('Erro ao rejeitar usuário:', error)
      setError('Erro ao rejeitar usuário')
    } finally {
      setProcessing(null)
    }
  }

  const formatDate = (date: any) => {
    if (!date) return 'N/A'
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <AuthGuard>
        <RoleGuard allowedRoles={['administrador']}>
          <Container>
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Carregando usuários pendentes...</p>
              </div>
            </div>
          </Container>
        </RoleGuard>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['administrador']}>
        <Container>
          <PageHeader
            title="Usuários"
            subtitle="Gerencie usuários do sistema e solicitações de acesso"
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Pendentes</p>
                      <p className="text-3xl font-bold text-warning-600">
                        {pendingUsers.length}
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
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Usuários Ativos</p>
                      <p className="text-3xl font-bold text-success-600">
                        {approvedUsers.length}
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
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Administradores</p>
                      <p className="text-3xl font-bold text-primary-600">
                        {approvedUsers.filter(u => u.perfil === 'administrador').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                      <Shield className="h-6 w-6 text-primary-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Abas */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'pending'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Solicitações Pendentes ({pendingUsers.length})</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('approved')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'approved'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Usuários Ativos ({approvedUsers.length})</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Conteúdo das Abas */}
          {activeTab === 'pending' && (
            <>
              {/* Lista de Usuários Pendentes */}
              {pendingUsers.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Nenhuma solicitação pendente
                    </h3>
                    <p className="text-gray-600">
                      Não há usuários aguardando aprovação no momento.
                    </p>
                  </CardContent>
                </Card>
              ) : (
            <div className="space-y-6">
              {pendingUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                              <Users className="h-6 w-6 text-primary-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {user.nomeCompleto}
                              </h3>
                              <p className="text-gray-600">{user.email}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Briefcase className="h-4 w-4" />
                              <span className="text-sm">{user.cargo}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span className="text-sm">
                                Cadastrado em {formatDate(user.dataCadastro)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => approveUser(user.id, 'funcionario')}
                              disabled={processing === user.id}
                              className="text-success-600 border-success-600 hover:bg-success-50"
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Aprovar como Funcionário
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => approveUser(user.id, 'administrador')}
                              disabled={processing === user.id}
                              className="text-primary-600 border-primary-600 hover:bg-primary-50"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Aprovar como Admin
                            </Button>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => rejectUser(user.id)}
                            disabled={processing === user.id}
                            className="text-error-600 border-error-600 hover:bg-error-50"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rejeitar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
            </>
          )}

          {activeTab === 'approved' && (
            <>
              {/* Lista de Usuários Aprovados */}
              {approvedUsers.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Nenhum usuário ativo
                    </h3>
                    <p className="text-gray-600">
                      Não há usuários aprovados no sistema ainda.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {approvedUsers.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                                  <UserCheck className="h-6 w-6 text-success-600" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {user.nomeCompleto}
                                  </h3>
                                  <p className="text-gray-600">{user.email}</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="flex items-center space-x-2 text-gray-600">
                                  <Briefcase className="h-4 w-4" />
                                  <span className="text-sm">{user.cargo}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-600">
                                  <Shield className="h-4 w-4" />
                                  <span className={`text-sm px-2 py-1 rounded-full ${
                                    user.perfil === 'administrador' 
                                      ? 'bg-primary-100 text-primary-800' 
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {user.perfil === 'administrador' ? 'Administrador' : 'Funcionário'}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-600">
                                  <Calendar className="h-4 w-4" />
                                  <span className="text-sm">
                                    Aprovado em {formatDate(user.dataAprovacao)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col space-y-2">
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateUserPermission(user.id, 'funcionario')}
                                  disabled={processing === user.id || user.perfil === 'funcionario'}
                                  className="text-gray-600 border-gray-600 hover:bg-gray-50"
                                >
                                  <UserCog className="h-4 w-4 mr-1" />
                                  Tornar Funcionário
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateUserPermission(user.id, 'administrador')}
                                  disabled={processing === user.id || user.perfil === 'administrador'}
                                  className="text-primary-600 border-primary-600 hover:bg-primary-50"
                                >
                                  <Shield className="h-4 w-4 mr-1" />
                                  Tornar Admin
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </Container>
      </RoleGuard>
    </AuthGuard>
  )
}
