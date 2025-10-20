'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { NewPreEnrollmentSchema, NewPreEnrollment } from '@/lib/pre-enrollment-schemas'
import { PreEnrollmentService } from '@/lib/pre-enrollment-service'
import { RACA_OPTIONS, RENDA_FAMILIAR_OPTIONS } from '@/lib/pre-enrollment-schemas'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Checkbox } from '@/components/ui/Checkbox'
import { 
  ArrowLeft, 
  User,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'

export default function NewPreEnrollmentPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<NewPreEnrollment>({
    resolver: zodResolver(NewPreEnrollmentSchema),
    defaultValues: {
      necessidadesEspeciais: false
    }
  })

  const necessidadesEspeciais = watch('necessidadesEspeciais')

  const onSubmit = async (data: NewPreEnrollment) => {
    if (!user?.uid) {
      toast.error('Usuário não autenticado')
      return
    }

    try {
      setLoading(true)
      const preEnrollmentId = await PreEnrollmentService.createPreEnrollment(data, user.uid)
      
      toast.success('Pré-matrícula criada com sucesso!')
      router.push('/pre-matriculas')
    } catch (error) {
      console.error('Erro ao criar pré-matrícula:', error)
      toast.error('Erro ao criar pré-matrícula')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Nova Pré-Matrícula
            </h1>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Informações da Criança */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Informações da Criança
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome da Criança *
                </label>
                <Input
                  {...register('nomeCrianca')}
                  placeholder="Digite o nome completo"
                  error={errors.nomeCrianca?.message}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Raça/Cor *
                </label>
                <Select
                  {...register('raca')}
                  error={errors.raca?.message}
                >
                  <option value="">Selecione a raça/cor</option>
                  {RACA_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data de Nascimento *
                </label>
                <Input
                  type="date"
                  {...register('dataNascimento', { 
                    valueAsDate: true 
                  })}
                  error={errors.dataNascimento?.message}
                />
              </div>
            </div>
          </Card>

          {/* Informações do Responsável */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              Informações do Responsável
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome do Responsável *
                </label>
                <Input
                  {...register('responsavelNome')}
                  placeholder="Digite o nome completo"
                  error={errors.responsavelNome?.message}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contato (Telefone/WhatsApp) *
                </label>
                <Input
                  {...register('responsavelContato')}
                  placeholder="(11) 99999-9999"
                  error={errors.responsavelContato?.message}
                />
              </div>
            </div>
          </Card>

          {/* Endereço */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Endereço
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Endereço Completo *
              </label>
              <Input
                {...register('endereco')}
                placeholder="Rua, número, bairro, cidade"
                error={errors.endereco?.message}
              />
            </div>
          </Card>

          {/* Necessidades Especiais */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Necessidades Especiais
            </h2>
            
            <div className="space-y-4">
              <Checkbox
                {...register('necessidadesEspeciais')}
                label="A criança possui necessidades especiais"
              />
              
              {necessidadesEspeciais && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descreva as necessidades especiais
                  </label>
                  <Textarea
                    {...register('descricaoNecessidade')}
                    placeholder="Descreva as necessidades especiais da criança"
                    rows={3}
                    error={errors.descricaoNecessidade?.message}
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Renda Familiar */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Renda Familiar
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Renda Familiar Estimada *
              </label>
              <Select
                {...register('rendaFamiliar')}
                error={errors.rendaFamiliar?.message}
              >
                <option value="">Selecione a faixa de renda</option>
                {RENDA_FAMILIAR_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </Card>

          {/* Botões */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Salvando...' : 'Salvar Pré-Matrícula'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}