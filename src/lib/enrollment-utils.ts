// Utilitários para formatação e máscaras
export const formatCPF = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '')
  return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export const formatPhone = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '')
  if (cleanValue.length <= 10) {
    return cleanValue.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return cleanValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
}

export const formatCEP = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '')
  return cleanValue.replace(/(\d{5})(\d{3})/, '$1-$2')
}

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export const parseCurrency = (value: string | number): number => {
  if (typeof value === 'number') {
    return value
  }
  
  if (typeof value !== 'string') {
    return 0
  }
  
  const cleanValue = value.replace(/[^\d,.-]/g, '')
  const normalizedValue = cleanValue.replace(',', '.')
  return parseFloat(normalizedValue) || 0
}

// Validação de CPF
export const validateCPF = (cpf: string): boolean => {
  const cleanCpf = cpf.replace(/\D/g, '')
  
  if (cleanCpf.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cleanCpf)) return false
  
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCpf.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCpf.charAt(9))) return false
  
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCpf.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCpf.charAt(10))) return false
  
  return true
}

// Busca CEP via ViaCEP
export interface CEPData {
  logradouro: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

export const fetchCEP = async (cep: string): Promise<CEPData | null> => {
  const cleanCep = cep.replace(/\D/g, '')
  
  if (cleanCep.length !== 8) {
    return null
  }
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
    const data = await response.json()
    
    if (data.erro) {
      return null
    }
    
    return {
      logradouro: data.logradouro || '',
      bairro: data.bairro || '',
      localidade: data.localidade || '',
      uf: data.uf || '',
      erro: data.erro
    }
  } catch (error) {
    console.error('Erro ao buscar CEP:', error)
    return null
  }
}

// Cálculo de renda per capita
export const calculateRendaPerCapita = (rendaTotal: number, numeroMembros: number): number => {
  if (numeroMembros === 0) return 0
  return rendaTotal / numeroMembros
}

// Formatação de data para exibição
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('pt-BR')
}

// Formatação de data para input
export const formatDateForInput = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0]
}

// Validação de idade
export const calculateAge = (birthDate: Date): number => {
  const today = new Date()
  const age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1
  }
  
  return age
}

// Validação de data de nascimento para creche (2-5 anos)
export const isValidBirthDateForCreche = (birthDate: Date): boolean => {
  const age = calculateAge(birthDate)
  return age >= 2 && age <= 5
}

// Geração de ID único para rascunhos
export const generateDraftId = (): string => {
  return `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Limpeza de dados para salvamento
export const cleanFormData = (data: any): any => {
  const cleaned = { ...data }
  
  // Remove campos vazios
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === '' || cleaned[key] === null || cleaned[key] === undefined) {
      delete cleaned[key]
    }
  })
  
  return cleaned
}

// Validação de campos condicionais
export const validateConditionalFields = (data: any, field: string, condition: boolean): boolean => {
  if (condition && (!data[field] || data[field] === '')) {
    return false
  }
  return true
}

// Formatação de erro para exibição
export const formatError = (error: any): string => {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  if (error?.errors?.[0]?.message) return error.errors[0].message
  return 'Erro desconhecido'
}

// Debounce para autosave
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Storage helpers para rascunhos
export const saveDraftToLocalStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Erro ao salvar rascunho no localStorage:', error)
  }
}

export const loadDraftFromLocalStorage = (key: string): any => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Erro ao carregar rascunho do localStorage:', error)
    return null
  }
}

export const removeDraftFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Erro ao remover rascunho do localStorage:', error)
  }
}
