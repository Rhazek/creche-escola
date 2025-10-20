'use client'

import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import SignupForm from '@/components/SignupForm'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, LogIn, ArrowRight, Shield, Users, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  const { user, loading } = useAuth()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setError('')

    try {
      console.log('Tentando fazer login com:', email)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      console.log('Login bem-sucedido:', user.uid, user.email)
      
      // Verificar se o usuário está aprovado
      // TODO: Implementar verificação de aprovação
      
      // Salvar perfil básico no localStorage para funcionamento imediato
      const userProfile = {
        uid: user.uid,
        email: user.email,
        nomeCompleto: user.email || 'Usuário',
        cpf: '',
        perfil: 'funcionario' // Perfil padrão, pode ser atualizado depois
      }
      
      localStorage.setItem('userProfile', JSON.stringify(userProfile))
      console.log('Profile saved to localStorage:', userProfile)
      
      // Aguardar um pouco para garantir que o localStorage foi salvo
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Redirecionar após salvar o perfil
      console.log('Redirecionando para dashboard...')
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Erro durante login:', error)
      if (error.code === 'auth/user-not-found') {
        setError('Usuário não encontrado. Verifique se sua conta foi aprovada.')
      } else if (error.code === 'auth/wrong-password') {
        setError('Senha incorreta')
      } else if (error.code === 'auth/invalid-email') {
        setError('Email inválido')
      } else {
        setError('Erro ao fazer login. Tente novamente.')
      }
    } finally {
      setAuthLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner h-12 w-12"></div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
        <div className="container-app py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Bem-vindo ao Sistema
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Gerencie as matrículas da creche-escola de forma eficiente e organizada
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Card className="text-center hover:shadow-medium transition-all duration-200">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestão de Matrículas</h3>
                  <p className="text-gray-600 text-sm">
                    Sistema completo para gerenciar as matrículas dos alunos
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card className="text-center hover:shadow-medium transition-all duration-200">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-success-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Controle de Acesso</h3>
                  <p className="text-gray-600 text-sm">
                    Autenticação segura para funcionários e administradores
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Card className="text-center hover:shadow-medium transition-all duration-200">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-6 w-6 text-warning-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Relatórios</h3>
                  <p className="text-gray-600 text-sm">
                    Geração de relatórios detalhados sobre as matrículas
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center"
          >
            <Button
              size="lg"
              icon={<ArrowRight className="h-5 w-5" />}
              onClick={() => router.push('/dashboard')}
            >
              Acessar Dashboard
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo e título */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            <span className="text-white font-bold text-2xl">CE</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Creche-Escola
          </h1>
          <p className="text-gray-600">
            Sistema de Gestão de Matrículas
          </p>
        </div>

        {/* Card de autenticação */}
        {mode === 'login' ? (
          <Card className="shadow-strong">
            <CardHeader
              title="Entrar"
              subtitle="Acesse sua conta para continuar"
            />
            
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  icon={<Mail className="h-4 w-4" />}
                  placeholder="seu@email.com"
                />
                
                <Input
                  type={showPassword ? 'text' : 'password'}
                  label="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  icon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                  iconPosition="right"
                  placeholder="••••••••"
                />

                {error && (
                  <div className="bg-error-50 border border-error-200 rounded-lg p-3">
                    <p className="text-error-600 text-sm">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  loading={authLoading}
                  fullWidth
                  size="lg"
                  icon={<LogIn className="h-4 w-4" />}
                >
                  Entrar
                </Button>
              </form>

              {/* Link para cadastro */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-center text-sm text-gray-600">
                  Não tem uma conta?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup')
                      setError('')
                    }}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Solicite acesso aqui
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <SignupForm />
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2024 Creche-Escola. Todos os direitos reservados.
          </p>
        </div>
      </motion.div>
    </div>
  )
}