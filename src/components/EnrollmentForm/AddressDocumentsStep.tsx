'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { FormField, Input, Select } from './FormField'
import { AddressDocumentsSchema, type AddressDocuments } from '@/lib/enrollment-schemas'
import { formatCEP, formatPhone, fetchCEP, formatDateForInput, formatCPF } from '@/lib/enrollment-utils'
import { MapPin, Home, Phone, FileText, Calendar, Search } from 'lucide-react'
import toast from 'react-hot-toast'

interface AddressDocumentsStepProps {
  data?: Partial<AddressDocuments>
  onSubmit: (data: AddressDocuments) => void
  onSaveDraft?: (data: Partial<AddressDocuments>) => void
  onDataChange?: (data: Partial<AddressDocuments>) => void
}

const UF_OPTIONS = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
]

export function AddressDocumentsStep({ data, onSubmit, onSaveDraft, onDataChange }: AddressDocumentsStepProps) {
  const [isLoadingCEP, setIsLoadingCEP] = useState(false)
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid }
  } = useForm<AddressDocuments>({
    resolver: zodResolver(AddressDocumentsSchema),
    defaultValues: {
      logradouro: '',
      numero: '',
      pontoReferencia: '',
      bairro: '',
      municipio: '',
      uf: '',
      cep: '',
      telefoneResidencial: '',
      telefoneContato: '',
      certidaoNascimento: '',
      municipioNascimento: '',
      municipioRegistro: '',
      cartorioRegistro: '',
      cpfCrianca: '',
      rgCrianca: '',
      dataEmissaoRg: undefined,
      orgaoEmissor: '',
      ...data
    }
  })

  const watchedValues = watch()

  // Atualizar valores do formulário quando os dados mudam
  useEffect(() => {
    if (data) {
      reset({
        logradouro: data.logradouro || '',
        numero: data.numero || '',
        bairro: data.bairro || '',
        municipio: data.municipio || '',
        uf: data.uf || '',
        cep: data.cep || '',
        pontoReferencia: data.pontoReferencia || '',
        telefoneResidencial: data.telefoneResidencial || '',
        telefoneContato: data.telefoneContato || '',
        certidaoNascimento: data.certidaoNascimento || '',
        municipioNascimento: data.municipioNascimento || '',
        municipioRegistro: data.municipioRegistro || '',
        cartorioRegistro: data.cartorioRegistro || '',
        cpfCrianca: data.cpfCrianca || '',
        rgCrianca: data.rgCrianca || '',
        dataEmissaoRg: data.dataEmissaoRg || undefined,
        orgaoEmissor: data.orgaoEmissor || ''
      })
    }
  }, [data, reset])

  // Notificar mudanças nos dados
  useEffect(() => {
    if (onDataChange) {
      onDataChange(watchedValues)
    }
  }, [watchedValues, onDataChange])

  const handleFormSubmit = (formData: AddressDocuments) => {
    onSubmit(formData)
  }

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft(watchedValues)
    }
  }

  const handleCEPChange = async (cep: string) => {
    const formattedCEP = formatCEP(cep)
    setValue('cep', formattedCEP)
    
    const cleanCEP = cep.replace(/\D/g, '')
    if (cleanCEP.length === 8) {
      setIsLoadingCEP(true)
      try {
        const cepData = await fetchCEP(cleanCEP)
        if (cepData && !cepData.erro) {
          setValue('logradouro', cepData.logradouro)
          setValue('bairro', cepData.bairro)
          setValue('municipio', cepData.localidade)
          setValue('uf', cepData.uf)
          toast.success('Endereço preenchido automaticamente!')
        } else {
          toast.error('CEP não encontrado')
        }
      } catch (error) {
        toast.error('Erro ao buscar CEP')
      } finally {
        setIsLoadingCEP(false)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Endereço */}
      <Card>
        <CardHeader title="Endereço" />
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="CEP"
              name="cep"
              required
              error={errors.cep?.message}
              helper="Digite o CEP para preenchimento automático"
            >
              <Input
                {...register('cep')}
                placeholder="00000-000"
                icon={<Search className="h-4 w-4 text-gray-400" />}
                error={errors.cep?.message}
                onChange={(e) => handleCEPChange(e.target.value)}
                disabled={isLoadingCEP}
              />
            </FormField>

            <FormField
              label="Logradouro"
              name="logradouro"
              required
              error={errors.logradouro?.message}
            >
              <Input
                {...register('logradouro')}
                placeholder="Rua, Avenida, etc."
                icon={<MapPin className="h-4 w-4 text-gray-400" />}
                error={errors.logradouro?.message}
              />
            </FormField>

            <FormField
              label="Número"
              name="numero"
              required
              error={errors.numero?.message}
            >
              <Input
                {...register('numero')}
                placeholder="123"
                icon={<Home className="h-4 w-4 text-gray-400" />}
                error={errors.numero?.message}
              />
            </FormField>

            <FormField
              label="Bairro"
              name="bairro"
              required
              error={errors.bairro?.message}
            >
              <Input
                {...register('bairro')}
                placeholder="Nome do bairro"
                error={errors.bairro?.message}
              />
            </FormField>

            <FormField
              label="Município"
              name="municipio"
              required
              error={errors.municipio?.message}
            >
              <Input
                {...register('municipio')}
                placeholder="Nome do município"
                error={errors.municipio?.message}
              />
            </FormField>

            <FormField
              label="UF"
              name="uf"
              required
              error={errors.uf?.message}
            >
              <Select
                {...register('uf')}
                options={UF_OPTIONS}
                placeholder="Selecione a UF"
                error={errors.uf?.message}
              />
            </FormField>

            <FormField
              label="Ponto de Referência"
              name="pontoReferencia"
              error={errors.pontoReferencia?.message}
              helper="Opcional - próximo ao que?"
            >
              <Input
                {...register('pontoReferencia')}
                placeholder="Próximo ao shopping, escola, etc."
                error={errors.pontoReferencia?.message}
              />
            </FormField>

            <FormField
              label="Telefone Residencial"
              name="telefoneResidencial"
              error={errors.telefoneResidencial?.message}
            >
              <Input
                {...register('telefoneResidencial')}
                placeholder="(00) 0000-0000"
                icon={<Phone className="h-4 w-4 text-gray-400" />}
                error={errors.telefoneResidencial?.message}
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value)
                  e.target.value = formatted
                }}
              />
            </FormField>

            <FormField
              label="Telefone de Contato"
              name="telefoneContato"
              error={errors.telefoneContato?.message}
            >
              <Input
                {...register('telefoneContato')}
                placeholder="(00) 00000-0000"
                icon={<Phone className="h-4 w-4 text-gray-400" />}
                error={errors.telefoneContato?.message}
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value)
                  e.target.value = formatted
                }}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Documentos */}
      <Card>
        <CardHeader title="Documentos da Criança" />
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Certidão de Nascimento"
              name="certidaoNascimento"
              error={errors.certidaoNascimento?.message}
            >
              <Input
                {...register('certidaoNascimento')}
                placeholder="Número da certidão"
                icon={<FileText className="h-4 w-4 text-gray-400" />}
                error={errors.certidaoNascimento?.message}
              />
            </FormField>

            <FormField
              label="Município de Nascimento"
              name="municipioNascimento"
              error={errors.municipioNascimento?.message}
            >
              <Input
                {...register('municipioNascimento')}
                placeholder="Município onde nasceu"
                error={errors.municipioNascimento?.message}
              />
            </FormField>

            <FormField
              label="Município de Registro"
              name="municipioRegistro"
              error={errors.municipioRegistro?.message}
            >
              <Input
                {...register('municipioRegistro')}
                placeholder="Município do registro"
                error={errors.municipioRegistro?.message}
              />
            </FormField>

            <FormField
              label="Cartório de Registro"
              name="cartorioRegistro"
              error={errors.cartorioRegistro?.message}
            >
              <Input
                {...register('cartorioRegistro')}
                placeholder="Nome do cartório"
                error={errors.cartorioRegistro?.message}
              />
            </FormField>

            <FormField
              label="CPF da Criança"
              name="cpfCrianca"
              error={errors.cpfCrianca?.message}
            >
              <Input
                {...register('cpfCrianca')}
                placeholder="000.000.000-00"
                icon={<FileText className="h-4 w-4 text-gray-400" />}
                error={errors.cpfCrianca?.message}
                onChange={(e) => {
                  const formatted = formatCPF(e.target.value)
                  e.target.value = formatted
                }}
              />
            </FormField>

            <FormField
              label="RG da Criança"
              name="rgCrianca"
              error={errors.rgCrianca?.message}
            >
              <Input
                {...register('rgCrianca')}
                placeholder="Número do RG"
                error={errors.rgCrianca?.message}
              />
            </FormField>

            <FormField
              label="Data de Emissão do RG"
              name="dataEmissaoRg"
              error={errors.dataEmissaoRg?.message}
            >
              <Input
                type="date"
                {...register('dataEmissaoRg', {
                  setValueAs: (value) => value ? new Date(value) : undefined
                })}
                icon={<Calendar className="h-4 w-4 text-gray-400" />}
                error={errors.dataEmissaoRg?.message}
              />
            </FormField>

            <FormField
              label="Órgão Emissor"
              name="orgaoEmissor"
              error={errors.orgaoEmissor?.message}
            >
              <Input
                {...register('orgaoEmissor')}
                placeholder="SSP, IFP, etc."
                error={errors.orgaoEmissor?.message}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

    </form>
  )
}
