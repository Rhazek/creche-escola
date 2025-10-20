'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { FormField, Input, Select, Textarea, Checkbox, RadioGroup, CheckboxList } from './FormField'
import { ChildInfoSchema, type ChildInfo } from '@/lib/enrollment-schemas'
import { formatDateForInput } from '@/lib/enrollment-utils'
import { 
  User, 
  Calendar, 
  Heart, 
  AlertTriangle, 
  Stethoscope,
  Shield,
  GraduationCap,
  HelpCircle
} from 'lucide-react'

interface ChildInfoStepProps {
  data?: Partial<ChildInfo>
  onSubmit: (data: ChildInfo) => void
  onSaveDraft?: (data: Partial<ChildInfo>) => void
  onDataChange?: (data: Partial<ChildInfo>) => void
}

const SEXO_OPTIONS = [
  { value: 'Masculino', label: 'Masculino' },
  { value: 'Feminino', label: 'Feminino' },
  { value: 'Outro', label: 'Outro' }
]

const COR_RACA_OPTIONS = [
  { value: 'Branca', label: 'Branca' },
  { value: 'Preta', label: 'Preta' },
  { value: 'Parda', label: 'Parda' },
  { value: 'Indígena', label: 'Indígena' },
  { value: 'Amarela', label: 'Amarela' },
  { value: 'Não declarada', label: 'Não declarada' }
]

const MOBILIDADE_REDUZIDA_OPTIONS = [
  { value: 'Nenhuma', label: 'Nenhuma' },
  { value: 'Temporária', label: 'Temporária' },
  { value: 'Permanente', label: 'Permanente' }
]

const CLASSIFICACAO_OPTIONS = [
  'TEA (Transtorno do Espectro Autista)',
  'TDAH (Transtorno de Déficit de Atenção e Hiperatividade)',
  'Surdez',
  'Cegueira',
  'Baixa Visão',
  'Deficiência Física',
  'Deficiência Intelectual',
  'Síndrome de Down',
  'Paralisia Cerebral',
  'Deficiência Múltipla',
  'Altas Habilidades/Superdotação',
  'Outro'
]

export function ChildInfoStep({ data, onSubmit, onSaveDraft, onDataChange }: ChildInfoStepProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid }
  } = useForm({
    resolver: zodResolver(ChildInfoSchema),
    defaultValues: {
      nome: data?.nome || '',
      identidade: data?.identidade || '',
      dataNascimento: data?.dataNascimento || undefined,
      sexo: data?.sexo || undefined,
      corRaca: data?.corRaca || undefined,
      gemeos: data?.gemeos || false,
      temIrmaosNaCreche: data?.temIrmaosNaCreche || false,
      nomeIrmaoNaCreche: data?.nomeIrmaoNaCreche || '',
      numeroSUS: data?.numeroSUS || '',
      unidadeSaude: data?.unidadeSaude || '',
      problemasSaude: data?.problemasSaude || '',
      restricaoAlimentar: data?.restricaoAlimentar || false,
      tipoRestricao: data?.tipoRestricao || '',
      alergia: data?.alergia || false,
      tipoAlergia: data?.tipoAlergia || '',
      mobilidadeReduzida: data?.mobilidadeReduzida || 'Nenhuma',
      possuiDeficienciasMultiplas: data?.possuiDeficienciasMultiplas || false,
      tipoDeficiencia: data?.tipoDeficiencia || '',
      publicoEducacaoEspecial: data?.publicoEducacaoEspecial || false,
      tipoEducacaoEspecial: data?.tipoEducacaoEspecial || '',
      classificacao: data?.classificacao || [],
      recebeAuxilioGoverno: data?.recebeAuxilioGoverno || false,
      tipoAuxilio: data?.tipoAuxilio || undefined,
      numeroNIS: data?.numeroNIS || ''
    }
  })

  const watchedValues = watch()

  // Atualizar valores do formulário quando os dados mudam
  useEffect(() => {
    if (data) {
      reset({
        nome: data.nome || '',
        identidade: data.identidade || '',
        dataNascimento: data.dataNascimento || undefined,
        sexo: data.sexo || undefined,
        corRaca: data.corRaca || undefined,
        gemeos: data.gemeos || false,
        temIrmaosNaCreche: data.temIrmaosNaCreche || false,
        nomeIrmaoNaCreche: data.nomeIrmaoNaCreche || '',
        numeroSUS: data.numeroSUS || '',
        unidadeSaude: data.unidadeSaude || '',
        problemasSaude: data.problemasSaude || '',
        restricaoAlimentar: data.restricaoAlimentar || false,
        tipoRestricao: data.tipoRestricao || '',
        alergia: data.alergia || false,
        tipoAlergia: data.tipoAlergia || '',
        mobilidadeReduzida: data.mobilidadeReduzida || 'Nenhuma',
        possuiDeficienciasMultiplas: data.possuiDeficienciasMultiplas || false,
        tipoDeficiencia: data.tipoDeficiencia || '',
        publicoEducacaoEspecial: data.publicoEducacaoEspecial || false,
        tipoEducacaoEspecial: data.tipoEducacaoEspecial || '',
        classificacao: data.classificacao || [],
        recebeAuxilioGoverno: data.recebeAuxilioGoverno || false,
        tipoAuxilio: data.tipoAuxilio || undefined,
        numeroNIS: data.numeroNIS || ''
      })
    }
  }, [data, reset])

  // Notificar mudanças nos dados
  useEffect(() => {
    if (onDataChange) {
      onDataChange(watchedValues)
    }
  }, [watchedValues, onDataChange])

  const handleFormSubmit = (formData: any) => {
    onSubmit(formData as ChildInfo)
  }

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft(watchedValues)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader title="Informações Básicas" />
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Nome Completo"
              name="nome"
              required
              error={errors.nome?.message}
            >
              <Input
                {...register('nome')}
                placeholder="Digite o nome completo"
                icon={<User className="h-4 w-4 text-gray-400" />}
                error={errors.nome?.message}
              />
            </FormField>

            <FormField
              label="RG"
              name="identidade"
              error={errors.identidade?.message}
            >
              <Input
                {...register('identidade')}
                placeholder="Digite o número do RG"
                error={errors.identidade?.message}
              />
            </FormField>

            <FormField
              label="Data de Nascimento"
              name="dataNascimento"
              required
              error={errors.dataNascimento?.message}
              helper="Idade deve estar entre 2 e 5 anos"
            >
              <Input
                type="date"
                {...register('dataNascimento', {
                  setValueAs: (value) => value ? new Date(value) : undefined
                })}
                error={errors.dataNascimento?.message}
                icon={<Calendar className="h-4 w-4 text-gray-400" />}
              />
            </FormField>

            <FormField
              label="Sexo"
              name="sexo"
              required
              error={errors.sexo?.message}
            >
              <Select
                {...register('sexo')}
                options={SEXO_OPTIONS}
                placeholder="Selecione o sexo"
                error={errors.sexo?.message}
              />
            </FormField>

            <FormField
              label="Cor/Raça"
              name="corRaca"
              required
              error={errors.corRaca?.message}
            >
              <Select
                {...register('corRaca')}
                options={COR_RACA_OPTIONS}
                placeholder="Selecione a cor/raça"
                error={errors.corRaca?.message}
              />
            </FormField>

            <div className="space-y-4">
              <Checkbox
                {...register('gemeos')}
                label="É gêmeo"
              />
              
              <div className="space-y-2">
                <Checkbox
                  {...register('temIrmaosNaCreche')}
                  label="Tem irmãos na creche"
                />
                <FormField
                  label="Nome do Irmão na Creche"
                  name="nomeIrmaoNaCreche"
                  error={errors.nomeIrmaoNaCreche?.message}
                >
                  <Input
                    {...register('nomeIrmaoNaCreche')}
                    placeholder="Digite o nome do irmão (opcional)"
                    error={errors.nomeIrmaoNaCreche?.message}
                  />
                </FormField>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações de Saúde */}
      <Card>
        <CardHeader title="Informações de Saúde" />
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Número SUS"
              name="numeroSUS"
              error={errors.numeroSUS?.message}
            >
              <Input
                {...register('numeroSUS')}
                placeholder="Digite o número do SUS"
                icon={<Stethoscope className="h-4 w-4 text-gray-400" />}
                error={errors.numeroSUS?.message}
              />
            </FormField>

            <FormField
              label="Unidade de Saúde"
              name="unidadeSaude"
              error={errors.unidadeSaude?.message}
            >
              <Input
                {...register('unidadeSaude')}
                placeholder="Digite a unidade de saúde"
                error={errors.unidadeSaude?.message}
              />
            </FormField>
          </div>

          <FormField
            label="Problemas de Saúde"
            name="problemasSaude"
            error={errors.problemasSaude?.message}
            helper="Descreva problemas de saúde conhecidos"
          >
            <Textarea
              {...register('problemasSaude')}
              placeholder="Descreva problemas de saúde conhecidos"
              rows={3}
              error={errors.problemasSaude?.message}
            />
          </FormField>

          <div className="space-y-4">
            <div className="space-y-2">
              <Checkbox
                {...register('restricaoAlimentar')}
                label="Possui restrição alimentar"
              />
              <FormField
                label="Tipo de Restrição"
                name="tipoRestricao"
                error={errors.tipoRestricao?.message}
              >
                <Input
                  {...register('tipoRestricao')}
                  placeholder="Qual tipo de restrição? (opcional)"
                  error={errors.tipoRestricao?.message}
                />
              </FormField>
            </div>

            <div className="space-y-2">
              <Checkbox
                {...register('alergia')}
                label="Possui alergia"
              />
              <FormField
                label="Tipo de Alergia"
                name="tipoAlergia"
                error={errors.tipoAlergia?.message}
              >
                <Input
                  {...register('tipoAlergia')}
                  placeholder="Qual tipo de alergia? (opcional)"
                  error={errors.tipoAlergia?.message}
                />
              </FormField>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobilidade e Deficiências */}
      <Card>
        <CardHeader title="Mobilidade e Deficiências" />
        <CardContent className="space-y-4">
          <FormField
            label="Mobilidade Reduzida"
            name="mobilidadeReduzida"
            error={errors.mobilidadeReduzida?.message}
          >
            <RadioGroup
              name="mobilidadeReduzida"
              options={MOBILIDADE_REDUZIDA_OPTIONS}
              value={watchedValues.mobilidadeReduzida}
              onChange={(value) => setValue('mobilidadeReduzida', value as any)}
              error={errors.mobilidadeReduzida?.message}
            />
          </FormField>

          <div className="space-y-4">
            <div className="space-y-2">
              <Checkbox
                {...register('possuiDeficienciasMultiplas')}
                label="Possui deficiências múltiplas"
              />
              <FormField
                label="Tipo de Deficiência"
                name="tipoDeficiencia"
                error={errors.tipoDeficiencia?.message}
              >
                <Input
                  {...register('tipoDeficiencia')}
                  placeholder="Descreva o tipo de deficiência (opcional)"
                  error={errors.tipoDeficiencia?.message}
                />
              </FormField>
            </div>

            <div className="space-y-2">
              <Checkbox
                {...register('publicoEducacaoEspecial')}
                label="É público de educação especial"
              />
              <FormField
                label="Tipo de Educação Especial"
                name="tipoEducacaoEspecial"
                error={errors.tipoEducacaoEspecial?.message}
              >
                <Input
                  {...register('tipoEducacaoEspecial')}
                  placeholder="Descreva o tipo de educação especial (opcional)"
                  error={errors.tipoEducacaoEspecial?.message}
                />
              </FormField>
            </div>
          </div>

          <FormField
            label="Classificação"
            name="classificacao"
            error={errors.classificacao?.message}
            helper="Selecione todas as classificações que se aplicam"
          >
            <CheckboxList
              name="classificacao"
              options={CLASSIFICACAO_OPTIONS}
              selectedValues={watchedValues.classificacao || []}
              onChange={(values) => setValue('classificacao', values)}
              error={errors.classificacao?.message}
            />
          </FormField>
        </CardContent>
      </Card>

      {/* Auxílio do Governo */}
      <Card>
        <CardHeader title="Auxílio do Governo" />
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Checkbox
              {...register('recebeAuxilioGoverno')}
              label="Recebe auxílio do governo"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Tipo de Auxílio"
                name="tipoAuxilio"
                error={errors.tipoAuxilio?.message}
              >
                <Select
                  {...register('tipoAuxilio')}
                  options={[
                    { value: '', label: 'Selecione o tipo de auxílio (opcional)' },
                    { value: 'Auxílio Brasil', label: 'Auxílio Brasil' },
                    { value: 'Benefício de Prestação Continuada (BPC)', label: 'Benefício de Prestação Continuada (BPC)' },
                    { value: 'Bolsa Família', label: 'Bolsa Família' },
                    { value: 'Auxílio-Gás', label: 'Auxílio-Gás' },
                    { value: 'Programa de Erradicação do Trabalho Infantil (PETI)', label: 'Programa de Erradicação do Trabalho Infantil (PETI)' },
                    { value: 'Outro', label: 'Outro' }
                  ]}
                  placeholder="Selecione o tipo de auxílio (opcional)"
                  error={errors.tipoAuxilio?.message}
                />
              </FormField>

              <FormField
                label="Número NIS"
                name="numeroNIS"
                error={errors.numeroNIS?.message}
              >
                <Input
                  {...register('numeroNIS')}
                  placeholder="Digite o número NIS (opcional)"
                  error={errors.numeroNIS?.message}
                />
              </FormField>
            </div>
          </div>
        </CardContent>
      </Card>

    </form>
  )
}
