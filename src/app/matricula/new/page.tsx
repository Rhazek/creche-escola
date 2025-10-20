'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import AuthGuard from '@/components/AuthGuard'
import RoleGuard from '@/components/RoleGuard'
import { EnrollmentWizard } from '@/components/EnrollmentForm/EnrollmentWizard'
import { EnrollmentService } from '@/lib/enrollment-service'
import { EnrollmentFormData } from '@/lib/enrollment-schemas'
import { PageHeader, Container } from '@/components/layout/LayoutWrapper'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, FileText, Save } from 'lucide-react'
import toast from 'react-hot-toast'

export default function NewEnrollmentPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleComplete = async (data: EnrollmentFormData) => {
    if (!user) {
      toast.error('Usuário não autenticado')
      return
    }

    setIsSubmitting(true)
    try {
      const enrollmentId = await EnrollmentService.createEnrollment(data, user.uid)
      toast.success('Matrícula criada com sucesso!')
      router.push(`/matricula/${enrollmentId}`)
    } catch (error) {
      console.error('Erro ao criar matrícula:', error)
      toast.error('Erro ao criar matrícula. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = async (data: Partial<EnrollmentFormData>) => {
    console.log('handleSaveDraft chamado com dados:', data)
    console.log('Usuário atual:', user)
    
    if (!user) {
      console.error('Usuário não autenticado')
      toast.error('Usuário não autenticado')
      return
    }

    try {
      const draftId = `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      console.log('Tentando salvar rascunho com:', { userId: user.uid, draftId, data })
      
      await EnrollmentService.saveDraft(user.uid, draftId, data)
      console.log('Rascunho salvo com sucesso!')
      toast.success('Rascunho salvo com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar rascunho:', error)
      toast.error('Erro ao salvar rascunho')
    }
  }

  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['funcionario', 'administrador']}>
        <Container>
          <PageHeader
            title="Nova Matrícula"
            subtitle="Preencha todas as informações para realizar a matrícula da criança"
          />

          {/* Informações importantes */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <p className="font-medium text-gray-900 dark:text-white mb-1">
                    Informações importantes:
                  </p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Todos os campos marcados com * são obrigatórios</li>
                    <li>Seus dados são salvos automaticamente como rascunho</li>
                    <li>Você pode voltar e editar informações anteriores</li>
                    <li>Após finalizar, a matrícula será enviada para aprovação</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wizard de matrícula */}
          <Card>
            <CardContent className="p-0">
              <EnrollmentWizard
                onComplete={handleComplete}
                onSaveDraft={handleSaveDraft}
                isEditing={false}
              />
            </CardContent>
          </Card>

          {/* Botão de voltar */}
          <div className="mt-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              icon={<ArrowLeft className="h-4 w-4" />}
            >
              Voltar
            </Button>
          </div>
        </Container>
      </RoleGuard>
    </AuthGuard>
  )
}
