'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface ApprovalStatusProps {
  status: 'pending' | 'approved' | 'rejected'
  userProfile?: {
    nomeCompleto: string
    email: string
    cargo: string
  }
}

export default function ApprovalStatus({ status, userProfile }: ApprovalStatusProps) {
  const router = useRouter()

  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="h-8 w-8 text-warning-600" />,
          title: 'Aguardando Aprovação',
          message: 'Sua solicitação de acesso está sendo analisada por um administrador.',
          bgColor: 'bg-warning-50',
          borderColor: 'border-warning-200',
          textColor: 'text-warning-800',
          iconBg: 'bg-warning-100'
        }
      case 'approved':
        return {
          icon: <CheckCircle className="h-8 w-8 text-success-600" />,
          title: 'Acesso Aprovado',
          message: 'Sua conta foi aprovada! Você pode acessar o sistema normalmente.',
          bgColor: 'bg-success-50',
          borderColor: 'border-success-200',
          textColor: 'text-success-800',
          iconBg: 'bg-success-100'
        }
      case 'rejected':
        return {
          icon: <XCircle className="h-8 w-8 text-error-600" />,
          title: 'Acesso Negado',
          message: 'Sua solicitação de acesso foi negada. Entre em contato com a administração.',
          bgColor: 'bg-error-50',
          borderColor: 'border-error-200',
          textColor: 'text-error-800',
          iconBg: 'bg-error-100'
        }
      default:
        return {
          icon: <AlertCircle className="h-8 w-8 text-gray-600" />,
          title: 'Status Desconhecido',
          message: 'Não foi possível determinar o status da sua conta.',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          iconBg: 'bg-gray-100'
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
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

        {/* Card de Status */}
        <Card className={`shadow-strong ${config.bgColor} ${config.borderColor} border-2`}>
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className={`w-16 h-16 ${config.iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}
            >
              {config.icon}
            </motion.div>
            
            <h2 className={`text-2xl font-bold ${config.textColor} mb-4`}>
              {config.title}
            </h2>
            
            <p className={`${config.textColor} mb-6`}>
              {config.message}
            </p>

            {/* Informações do usuário */}
            {userProfile && (
              <div className={`${config.bgColor} rounded-lg p-4 mb-6`}>
                <h3 className={`font-semibold ${config.textColor} mb-2`}>
                  Suas Informações
                </h3>
                <div className="text-sm space-y-1">
                  <p className={config.textColor}>
                    <strong>Nome:</strong> {userProfile.nomeCompleto}
                  </p>
                  <p className={config.textColor}>
                    <strong>Email:</strong> {userProfile.email}
                  </p>
                  <p className={config.textColor}>
                    <strong>Cargo:</strong> {userProfile.cargo}
                  </p>
                </div>
              </div>
            )}

            {/* Ações baseadas no status */}
            <div className="space-y-3">
              {status === 'approved' && (
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="w-full"
                  size="lg"
                >
                  Acessar Sistema
                </Button>
              )}
              
              {status === 'pending' && (
                <div className="space-y-2">
                  <p className={`text-sm ${config.textColor}`}>
                    Você receberá um email quando sua conta for aprovada.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/')}
                    className="w-full"
                  >
                    Voltar ao Login
                  </Button>
                </div>
              )}
              
              {status === 'rejected' && (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/')}
                    className="w-full"
                  >
                    Tentar Novamente
                  </Button>
                  <p className={`text-xs ${config.textColor}`}>
                    Se você acredita que houve um erro, entre em contato com a administração.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

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
