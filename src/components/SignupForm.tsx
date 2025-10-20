'use client'

import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { collection, addDoc, setDoc, doc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
// import { Select } from '@/components/ui/Select'
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Briefcase,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { motion } from 'framer-motion'

interface SignupFormData {
  nomeCompleto: string
  email: string
  password: string
  confirmPassword: string
  cargo: string
}

export default function SignupForm() {
  const [formData, setFormData] = useState<SignupFormData>({
    nomeCompleto: '',
    email: '',
    password: '',
    confirmPassword: '',
    cargo: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const cargos = [
    'Professor(a)',
    'Coordenador(a)',
    'Diretor(a)',
    'Secretário(a)',
    'Auxiliar de Ensino',
    'Auxiliar Administrativo',
    'Outro'
  ]

  const validateForm = () => {
    if (!formData.nomeCompleto.trim()) {
      setError('Nome completo é obrigatório')
      return false
    }
    if (!formData.email.trim()) {
      setError('Email é obrigatório')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Email inválido')
      return false
    }
    if (formData.password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Senhas não coincidem')
      return false
    }
    if (!formData.cargo) {
      setError('Cargo é obrigatório')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!validateForm()) return

    setLoading(true)

    try {
      console.log('Iniciando processo de cadastro...')
      
      // 1. Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      )
      const user = userCredential.user
      console.log('Usuário criado no Firebase Auth:', user.uid)

      // 2. Salvar dados de cadastro no Firestore para aprovação
      const userData = {
        uid: user.uid,
        nomeCompleto: formData.nomeCompleto.trim(),
        email: formData.email.trim(),
        cargo: formData.cargo,
        status: 'pending', // Aguardando aprovação
        dataCadastro: new Date(),
        aprovadoPor: null,
        dataAprovacao: null,
        perfil: null // Será definido pelo administrador
      }

      await setDoc(doc(db, 'usuarios_pendentes', user.uid), userData)
      console.log('Dados salvos para aprovação')

      // 3. Salvar perfil no localStorage para mostrar tela de aprovação
      const userProfile = {
        uid: user.uid,
        email: user.email,
        nomeCompleto: formData.nomeCompleto.trim(),
        cpf: '',
        perfil: 'funcionario' as 'funcionario' | 'administrador',
        status: 'pending' as 'pending' | 'approved' | 'rejected'
      }
      
      localStorage.setItem('userProfile', JSON.stringify(userProfile))
      console.log('Perfil salvo no localStorage - aguardando aprovação')

      // 4. Redirecionar para página principal após um pequeno delay
      setTimeout(() => {
        router.push('/')
      }, 2000)

      setSuccess(true)
      
      // Limpar formulário
      setFormData({
        nomeCompleto: '',
        email: '',
        password: '',
        confirmPassword: '',
        cargo: ''
      })

    } catch (error: any) {
      console.error('Erro durante cadastro:', error)
      
      if (error.code === 'auth/email-already-in-use') {
        setError('Este email já está em uso')
      } else if (error.code === 'auth/weak-password') {
        setError('Senha muito fraca')
      } else if (error.code === 'auth/invalid-email') {
        setError('Email inválido')
      } else {
        setError('Erro ao criar conta. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof SignupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('') // Limpar erro ao digitar
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="h-8 w-8 text-green-600" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Cadastro Realizado!
            </h2>
            
            <p className="text-gray-600 mb-6">
              Seu cadastro foi enviado para aprovação. Você será redirecionado para 
              a página principal onde poderá acompanhar o status da sua solicitação.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 text-blue-800">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Próximos passos:</span>
              </div>
              <ul className="text-blue-700 text-sm mt-2 space-y-1">
                <li>• Você será redirecionado para a página principal</li>
                <li>• Verá o status "Aguardando Aprovação"</li>
                <li>• Aguarde a aprovação de um administrador</li>
                <li>• Após aprovação, terá acesso completo ao sistema</li>
              </ul>
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
              <span className="text-sm">Redirecionando para página principal...</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="max-w-md mx-auto">
        <CardHeader
          title="Cadastro de Usuário"
          subtitle="Preencha os dados para solicitar acesso ao sistema"
        />
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nome Completo"
              value={formData.nomeCompleto}
              onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
              required
              icon={<User className="h-4 w-4" />}
              placeholder="Digite seu nome completo"
            />
            
            <Input
              type="email"
              label="Email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              icon={<Mail className="h-4 w-4" />}
              placeholder="seu@email.com"
            />
            
            <Input
              type={showPassword ? 'text' : 'password'}
              label="Senha"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
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
            
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirmar Senha"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              required
              icon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              iconPosition="right"
              placeholder="••••••••"
            />
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Cargo na Escola
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  value={formData.cargo}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('cargo', e.target.value)}
                  required
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Selecione seu cargo</option>
                  {cargos.map((cargo) => (
                    <option key={cargo} value={cargo}>
                      {cargo}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              fullWidth
              size="lg"
            >
              Solicitar Cadastro
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Já tem uma conta?{' '}
              <button
                type="button"
                onClick={() => router.push('/')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Faça login aqui
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
