import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  onSnapshot
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { 
  Enrollment, 
  EnrollmentFilters,
  EnrollmentStats,
  EnrollmentStatus
} from '@/lib/enrollment-list-schemas'
import { PreEnrollment } from '@/lib/pre-enrollment-schemas'

// Função para limpar valores undefined
function cleanUndefinedValues(obj: any): any {
  if (obj === null || obj === undefined) {
    return null
  }
  
  if (Array.isArray(obj)) {
    return obj.map(cleanUndefinedValues)
  }
  
  if (typeof obj === 'object') {
    const cleaned: any = {}
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = cleanUndefinedValues(value)
      }
    }
    return cleaned
  }
  
  return obj
}

// Serviço para operações CRUD de matrículas
export class EnrollmentListService {
  // Criar matrícula a partir de pré-matrícula aprovada
  static async createEnrollmentFromPreEnrollment(
    preEnrollment: PreEnrollment,
    userId: string
  ): Promise<string> {
    try {
      // Converter data de nascimento de string para Date e depois para ISO string
      const dataNascimento = new Date(preEnrollment.dataNascimento).toISOString()
      
      console.log('📅 Data de nascimento da pré-matrícula:', preEnrollment.dataNascimento)
      console.log('📅 Data convertida para ISO string:', dataNascimento)
      
      const enrollmentData = {
        // Dados da criança (mapeamento direto)
        nome: preEnrollment.nomeCrianca,
        dataNascimento: dataNascimento,
        corRaca: preEnrollment.raca,
        
        // Dados do responsável (primeiro responsável)
        guardians: [{
          tipoResponsavel: 'Outro' as const,
          nome: preEnrollment.responsavelNome,
          celular: preEnrollment.responsavelContato
        }],
        
        // Endereço (mapeamento simplificado)
        logradouro: preEnrollment.endereco,
        numero: '',
        bairro: '',
        municipio: '',
        uf: '',
        cep: '',
        
        // Necessidades especiais
        mobilidadeReduzida: preEnrollment.necessidadesEspeciais ? 'Permanente' : 'Nenhuma',
        tipoDeficiencia: preEnrollment.descricaoNecessidade,
        
        // Status e informações do sistema
        status: 'pendente_matricula' as const,
        preEnrollmentId: preEnrollment.id,
        criadoEm: serverTimestamp() as Timestamp,
        criadoPor: userId
      }

      const cleanedData = cleanUndefinedValues(enrollmentData)
      const enrollmentRef = await addDoc(collection(db, 'enrollments'), cleanedData)
      
      console.log('✅ Matrícula criada a partir de pré-matrícula:', enrollmentRef.id)
      return enrollmentRef.id
    } catch (error) {
      console.error('Erro ao criar matrícula a partir de pré-matrícula:', error)
      throw new Error('Erro ao criar matrícula')
    }
  }

  // Buscar matrícula por ID
  static async getEnrollment(id: string): Promise<Enrollment | null> {
    try {
      const enrollmentDoc = await getDoc(doc(db, 'enrollments', id))
      
      if (!enrollmentDoc.exists()) {
        return null
      }

      const data = enrollmentDoc.data()
      
      // Mapear campos corretamente (suporta tanto o formato antigo quanto o novo)
      const nomeCrianca = data.nomeCrianca || data.nome || ''
      const raca = data.raca || data.corRaca || ''
      const responsavelNome = data.responsavelNome || (data.guardians?.[0]?.nome) || ''
      const responsavelContato = data.responsavelContato || (data.guardians?.[0]?.celular) || ''
      const endereco = data.endereco || data.logradouro || ''
      
      // Converter data de nascimento para string ISO se necessário
      let dataNascimento = data.dataNascimento
      console.log('📅 Antes da conversão:', dataNascimento, 'tipo:', typeof dataNascimento)
      
      // Verificar se é um Map
      if (dataNascimento && typeof dataNascimento === 'object' && dataNascimento.constructor.name === 'Map') {
        console.log('📅 É um Map, convertendo...')
        dataNascimento = new Date(dataNascimento.get('seconds') * 1000).toISOString()
      } else if (dataNascimento instanceof Date) {
        dataNascimento = dataNascimento.toISOString()
        console.log('📅 Convertido de Date para ISO')
      } else if (dataNascimento && typeof dataNascimento.toDate === 'function') {
        dataNascimento = dataNascimento.toDate().toISOString()
        console.log('📅 Convertido de Timestamp para ISO')
      } else if (typeof dataNascimento === 'string') {
        console.log('📅 Já é string:', dataNascimento)
      } else {
        dataNascimento = new Date().toISOString()
        console.log('📅 Usando data atual como fallback')
      }
      
      console.log('📅 Depois da conversão:', dataNascimento)
      
      return {
        id: enrollmentDoc.id,
        nomeCrianca,
        raca,
        dataNascimento,
        responsavelNome,
        responsavelContato,
        endereco,
        necessidadesEspeciais: data.necessidadesEspeciais || false,
        descricaoNecessidade: data.descricaoNecessidade || data.tipoDeficiencia || '',
        rendaFamiliar: data.rendaFamiliar || '',
        status: data.status,
        anoLetivo: data.anoLetivo,
        serie: data.serie,
        criadoEm: data.criadoEm?.toDate?.()?.toISOString() || new Date().toISOString(),
        criadoPor: data.criadoPor,
        atualizadoEm: data.atualizadoEm?.toDate?.()?.toISOString(),
        atualizadoPor: data.atualizadoPor,
        preEnrollmentId: data.preEnrollmentId
      }
    } catch (error) {
      console.error('Erro ao buscar matrícula:', error)
      throw new Error('Erro ao buscar matrícula')
    }
  }

  // Listar matrículas com filtros
  static async getEnrollments(filters?: EnrollmentFilters): Promise<Enrollment[]> {
    try {
      console.log('🔍 Buscando matrículas com filtros:', filters)
      
      // Consulta simples sem ordenação complexa para evitar necessidade de índices
      let q = query(collection(db, 'enrollments'))

      // Aplicar filtros simples (apenas um por vez para evitar índices compostos)
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status))
      } else if (filters?.raca) {
        q = query(q, where('raca', '==', filters.raca))
      } else if (filters?.rendaFamiliar) {
        q = query(q, where('rendaFamiliar', '==', filters.rendaFamiliar))
      }

      // Ordenação simples apenas por data de criação
      q = query(q, orderBy('criadoEm', 'desc'))

      const snapshot = await getDocs(q)
      console.log('📊 Snapshot recebido:', snapshot.size, 'documentos')
      
      const enrollments: Enrollment[] = []

      snapshot.forEach((doc) => {
        const data = doc.data()
        console.log('📄 Documento completo:', doc.id, data)
        console.log('📅 dataNascimento original:', data.dataNascimento, typeof data.dataNascimento)
        
        // Mapear campos corretamente (suporta tanto o formato antigo quanto o novo)
        const nomeCrianca = data.nomeCrianca || data.nome || ''
        const raca = data.raca || data.corRaca || ''
        const responsavelNome = data.responsavelNome || (data.guardians?.[0]?.nome) || ''
        const responsavelContato = data.responsavelContato || (data.guardians?.[0]?.celular) || ''
        const endereco = data.endereco || data.logradouro || ''
        
        // Converter data de nascimento para string ISO se necessário
        let dataNascimento = data.dataNascimento
        console.log('📅 Antes da conversão:', dataNascimento, 'tipo:', typeof dataNascimento)
        
        // Verificar se é um Map
        if (dataNascimento && typeof dataNascimento === 'object' && dataNascimento.constructor.name === 'Map') {
          console.log('📅 É um Map, convertendo...')
          dataNascimento = new Date(dataNascimento.get('seconds') * 1000).toISOString()
        } else if (dataNascimento instanceof Date) {
          dataNascimento = dataNascimento.toISOString()
          console.log('📅 Convertido de Date para ISO')
        } else if (dataNascimento && typeof dataNascimento.toDate === 'function') {
          dataNascimento = dataNascimento.toDate().toISOString()
          console.log('📅 Convertido de Timestamp para ISO')
        } else if (typeof dataNascimento === 'string') {
          console.log('📅 Já é string:', dataNascimento)
        } else {
          dataNascimento = new Date().toISOString()
          console.log('📅 Usando data atual como fallback')
        }
        
        console.log('📅 Depois da conversão:', dataNascimento)
        
        enrollments.push({
          id: doc.id,
          nomeCrianca,
          raca,
          dataNascimento,
          responsavelNome,
          responsavelContato,
          endereco,
          necessidadesEspeciais: data.necessidadesEspeciais || false,
          descricaoNecessidade: data.descricaoNecessidade || data.tipoDeficiencia || '',
          rendaFamiliar: data.rendaFamiliar || '',
          status: data.status,
          anoLetivo: data.anoLetivo,
          serie: data.serie,
          criadoEm: data.criadoEm?.toDate?.()?.toISOString() || new Date().toISOString(),
          criadoPor: data.criadoPor,
          atualizadoEm: data.atualizadoEm?.toDate?.()?.toISOString(),
          atualizadoPor: data.atualizadoPor,
          preEnrollmentId: data.preEnrollmentId
        })
      })

      console.log('✅ Matrículas processadas:', enrollments.length)

      // Aplicar filtros adicionais no frontend
      let filteredEnrollments = enrollments

      // Filtro de nome
      if (filters?.nome) {
        filteredEnrollments = filteredEnrollments.filter(enrollment =>
          enrollment.nomeCrianca.toLowerCase().includes(filters.nome!.toLowerCase()) ||
          enrollment.responsavelNome.toLowerCase().includes(filters.nome!.toLowerCase())
        )
      }

      // Filtro de ano letivo
      if (filters?.anoLetivo) {
        filteredEnrollments = filteredEnrollments.filter(enrollment =>
          enrollment.anoLetivo === filters.anoLetivo
        )
      }

      // Filtro de série
      if (filters?.serie) {
        filteredEnrollments = filteredEnrollments.filter(enrollment =>
          enrollment.serie === filters.serie
        )
      }

      // Ordenação manual: pendentes primeiro
      filteredEnrollments.sort((a, b) => {
        if (a.status === 'pendente_matricula' && b.status !== 'pendente_matricula') return -1
        if (a.status !== 'pendente_matricula' && b.status === 'pendente_matricula') return 1
        return 0
      })

      return filteredEnrollments
    } catch (error) {
      console.error('Erro ao listar matrículas:', error)
      throw new Error('Erro ao listar matrículas')
    }
  }

  // Obter estatísticas do dashboard
  static async getStats(): Promise<EnrollmentStats> {
    try {
      const snapshot = await getDocs(collection(db, 'enrollments'))
      
      let pendentes = 0
      let confirmadas = 0
      let canceladas = 0

      snapshot.forEach((doc) => {
        const data = doc.data()
        switch (data.status) {
          case 'pendente_matricula':
            pendentes++
            break
          case 'confirmada':
            confirmadas++
            break
          case 'cancelada':
            canceladas++
            break
        }
      })

      return {
        pendentes,
        confirmadas,
        canceladas,
        total: pendentes + confirmadas + canceladas
      }
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error)
      throw new Error('Erro ao obter estatísticas')
    }
  }

  // Atualizar status da matrícula
  static async updateEnrollmentStatus(
    id: string,
    status: EnrollmentStatus,
    userId: string
  ): Promise<void> {
    try {
      await updateDoc(doc(db, 'enrollments', id), {
        status,
        atualizadoEm: serverTimestamp() as Timestamp,
        atualizadoPor: userId
      })
    } catch (error) {
      console.error('Erro ao atualizar status da matrícula:', error)
      throw new Error('Erro ao atualizar status da matrícula')
    }
  }

  // Cancelar matrícula
  static async cancelEnrollment(id: string, userId: string): Promise<void> {
    try {
      await this.updateEnrollmentStatus(id, 'cancelada', userId)
    } catch (error) {
      console.error('Erro ao cancelar matrícula:', error)
      throw new Error('Erro ao cancelar matrícula')
    }
  }

  // Confirmar matrícula
  static async confirmEnrollment(id: string, userId: string): Promise<void> {
    try {
      await this.updateEnrollmentStatus(id, 'confirmada', userId)
    } catch (error) {
      console.error('Erro ao confirmar matrícula:', error)
      throw new Error('Erro ao confirmar matrícula')
    }
  }

  // Atualizar dados da matrícula
  static async updateEnrollment(
    id: string,
    data: Partial<Enrollment>,
    userId: string
  ): Promise<void> {
    try {
      const updateData: any = {
        ...data,
        atualizadoEm: serverTimestamp() as Timestamp,
        atualizadoPor: userId
      }

      const cleanedData = cleanUndefinedValues(updateData)
      await updateDoc(doc(db, 'enrollments', id), cleanedData)
    } catch (error) {
      console.error('Erro ao atualizar matrícula:', error)
      throw new Error('Erro ao atualizar matrícula')
    }
  }
}
