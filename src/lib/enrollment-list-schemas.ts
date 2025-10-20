import { z } from 'zod'

// Schema para filtros de matrícula
export const EnrollmentFiltersSchema = z.object({
  nome: z.string().optional(),
  raca: z.string().optional(),
  rendaFamiliar: z.string().optional(),
  status: z.string().optional(),
  anoLetivo: z.string().optional(),
  serie: z.string().optional()
})

// Tipos TypeScript
export type EnrollmentFilters = z.infer<typeof EnrollmentFiltersSchema>

// Status de matrícula
export type EnrollmentStatus = 'pendente_matricula' | 'confirmada' | 'cancelada'

// Interface para matrícula completa
export interface Enrollment {
  id: string
  // Dados da criança
  nomeCrianca: string
  raca: 'Branca' | 'Preta' | 'Parda' | 'Amarela' | 'Indígena'
  dataNascimento: string
  
  // Dados do responsável
  responsavelNome: string
  responsavelContato: string
  
  // Endereço
  endereco: string
  
  // Necessidades especiais
  necessidadesEspeciais: boolean
  descricaoNecessidade?: string
  
  // Renda
  rendaFamiliar: 'Até 1 SM' | '1 a 2 SM' | '2 a 3 SM' | 'Acima de 3 SM'
  
  // Status e informações do sistema
  status: EnrollmentStatus
  anoLetivo?: string
  serie?: string
  
  // Metadados
  criadoEm: string
  criadoPor?: string
  atualizadoEm?: string
  atualizadoPor?: string
  
  // Relacionamento com pré-matrícula (opcional)
  preEnrollmentId?: string
}

// Estatísticas do dashboard
export interface EnrollmentStats {
  pendentes: number
  confirmadas: number
  canceladas: number
  total: number
}

// Opções para selects
export const RACA_OPTIONS = [
  { value: 'Branca', label: 'Branca' },
  { value: 'Preta', label: 'Preta' },
  { value: 'Parda', label: 'Parda' },
  { value: 'Amarela', label: 'Amarela' },
  { value: 'Indígena', label: 'Indígena' }
] as const

export const RENDA_FAMILIAR_OPTIONS = [
  { value: 'Até 1 SM', label: 'Até 1 SM' },
  { value: '1 a 2 SM', label: '1 a 2 SM' },
  { value: '2 a 3 SM', label: '2 a 3 SM' },
  { value: 'Acima de 3 SM', label: 'Acima de 3 SM' }
] as const

export const STATUS_OPTIONS = [
  { value: 'pendente_matricula', label: 'Pendente de Matrícula' },
  { value: 'confirmada', label: 'Confirmada' },
  { value: 'cancelada', label: 'Cancelada' }
] as const

export const ANO_LETIVO_OPTIONS = [
  { value: '2024', label: '2024' },
  { value: '2025', label: '2025' },
  { value: '2026', label: '2026' }
] as const

export const SERIE_OPTIONS = [
  { value: 'Berçário I', label: 'Berçário I' },
  { value: 'Berçário II', label: 'Berçário II' },
  { value: 'Maternal I', label: 'Maternal I' },
  { value: 'Maternal II', label: 'Maternal II' },
  { value: 'Pré I', label: 'Pré I' },
  { value: 'Pré II', label: 'Pré II' }
] as const

// Funções utilitárias
export const calcularIdade = (dataNascimento: string): number => {
  const hoje = new Date()
  const nascimento = new Date(dataNascimento)
  let idade = hoje.getFullYear() - nascimento.getFullYear()
  const mesAtual = hoje.getMonth()
  const mesNascimento = nascimento.getMonth()
  
  if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
    idade--
  }
  
  return idade
}

export const formatarData = (data: string): string => {
  return new Date(data).toLocaleDateString('pt-BR')
}

export const formatarTelefone = (telefone: string | undefined): string => {
  if (!telefone) return ''
  const cleaned = telefone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return telefone
}
