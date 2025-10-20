import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { 
  NewPreEnrollment, 
  UpdatePreEnrollment, 
  PreEnrollment, 
  PreEnrollmentFilters,
  PreEnrollmentStats 
} from '@/lib/pre-enrollment-schemas'

// Função para limpar valores undefined antes de enviar para o Firestore
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

// Serviço para operações CRUD de pré-matrículas
export class PreEnrollmentService {
  // Criar nova pré-matrícula
  static async createPreEnrollment(data: NewPreEnrollment, userId: string): Promise<string> {
    try {
      const preEnrollmentData = {
        nomeCrianca: data.nomeCrianca,
        raca: data.raca,
        dataNascimento: data.dataNascimento.toISOString(),
        responsavelNome: data.responsavelNome,
        responsavelContato: data.responsavelContato,
        endereco: data.endereco,
        necessidadesEspeciais: data.necessidadesEspeciais,
        descricaoNecessidade: data.descricaoNecessidade,
        rendaFamiliar: data.rendaFamiliar,
        status: 'analise' as const,
        criadoEm: serverTimestamp() as Timestamp,
        criadoPor: userId
      }

      // Limpar valores undefined
      const cleanedData = cleanUndefinedValues(preEnrollmentData)

      // Criar documento principal
      const preEnrollmentRef = await addDoc(collection(db, 'pre_enrollments'), cleanedData)
      return preEnrollmentRef.id
    } catch (error) {
      console.error('Erro ao criar pré-matrícula:', error)
      throw new Error('Erro ao criar pré-matrícula')
    }
  }

  // Buscar pré-matrícula por ID
  static async getPreEnrollment(id: string): Promise<PreEnrollment | null> {
    try {
      const preEnrollmentDoc = await getDoc(doc(db, 'pre_enrollments', id))
      
      if (!preEnrollmentDoc.exists()) {
        return null
      }

      const data = preEnrollmentDoc.data()
      return {
        id: preEnrollmentDoc.id,
        nomeCrianca: data.nomeCrianca,
        raca: data.raca,
        dataNascimento: data.dataNascimento,
        responsavelNome: data.responsavelNome,
        responsavelContato: data.responsavelContato,
        endereco: data.endereco,
        necessidadesEspeciais: data.necessidadesEspeciais,
        descricaoNecessidade: data.descricaoNecessidade,
        rendaFamiliar: data.rendaFamiliar,
        status: data.status,
        criadoEm: data.criadoEm?.toDate?.()?.toISOString() || new Date().toISOString(),
        avaliadoPor: data.avaliadoPor,
        dataDecisao: data.dataDecisao?.toDate?.()?.toISOString(),
        motivoRejeicao: data.motivoRejeicao
      }
    } catch (error) {
      console.error('Erro ao buscar pré-matrícula:', error)
      throw new Error('Erro ao buscar pré-matrícula')
    }
  }

  // Listar pré-matrículas com filtros
  static async getPreEnrollments(filters?: PreEnrollmentFilters): Promise<PreEnrollment[]> {
    try {
      // Consulta simples sem ordenação complexa para evitar necessidade de índices
      let q = query(collection(db, 'pre_enrollments'))

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
      const preEnrollments: PreEnrollment[] = []

      snapshot.forEach((doc) => {
        const data = doc.data()
        preEnrollments.push({
          id: doc.id,
          nomeCrianca: data.nomeCrianca,
          raca: data.raca,
          dataNascimento: data.dataNascimento,
          responsavelNome: data.responsavelNome,
          responsavelContato: data.responsavelContato,
          endereco: data.endereco,
          necessidadesEspeciais: data.necessidadesEspeciais,
          descricaoNecessidade: data.descricaoNecessidade,
          rendaFamiliar: data.rendaFamiliar,
          status: data.status,
          criadoEm: data.criadoEm?.toDate?.()?.toISOString() || new Date().toISOString(),
          avaliadoPor: data.avaliadoPor,
          dataDecisao: data.dataDecisao?.toDate?.()?.toISOString(),
          motivoRejeicao: data.motivoRejeicao
        })
      })

      // Aplicar filtros adicionais no frontend
      let filteredPreEnrollments = preEnrollments

      // Filtro de nome (busca textual)
      if (filters?.nome) {
        filteredPreEnrollments = filteredPreEnrollments.filter(preEnrollment =>
          preEnrollment.nomeCrianca.toLowerCase().includes(filters.nome!.toLowerCase()) ||
          preEnrollment.responsavelNome.toLowerCase().includes(filters.nome!.toLowerCase())
        )
      }

      // Ordenação manual: em análise primeiro
      filteredPreEnrollments.sort((a, b) => {
        if (a.status === 'analise' && b.status !== 'analise') return -1
        if (a.status !== 'analise' && b.status === 'analise') return 1
        return 0
      })

      return filteredPreEnrollments
    } catch (error) {
      console.error('Erro ao listar pré-matrículas:', error)
      throw new Error('Erro ao listar pré-matrículas')
    }
  }

  // Atualizar pré-matrícula
  static async updatePreEnrollment(id: string, data: UpdatePreEnrollment, userId: string): Promise<void> {
    try {
      const updateData: any = {
        atualizadoEm: serverTimestamp() as Timestamp,
        atualizadoPor: userId
      }

      // Adicionar campos que foram fornecidos
      if (data.nomeCrianca !== undefined) updateData.nomeCrianca = data.nomeCrianca
      if (data.raca !== undefined) updateData.raca = data.raca
      if (data.dataNascimento !== undefined) updateData.dataNascimento = data.dataNascimento.toISOString()
      if (data.responsavelNome !== undefined) updateData.responsavelNome = data.responsavelNome
      if (data.responsavelContato !== undefined) updateData.responsavelContato = data.responsavelContato
      if (data.endereco !== undefined) updateData.endereco = data.endereco
      if (data.necessidadesEspeciais !== undefined) updateData.necessidadesEspeciais = data.necessidadesEspeciais
      if (data.descricaoNecessidade !== undefined) updateData.descricaoNecessidade = data.descricaoNecessidade
      if (data.rendaFamiliar !== undefined) updateData.rendaFamiliar = data.rendaFamiliar

      // Limpar valores undefined
      const cleanedData = cleanUndefinedValues(updateData)

      await updateDoc(doc(db, 'pre_enrollments', id), cleanedData)
    } catch (error) {
      console.error('Erro ao atualizar pré-matrícula:', error)
      throw new Error('Erro ao atualizar pré-matrícula')
    }
  }

  // Aprovar pré-matrícula
  static async approvePreEnrollment(id: string, userId: string): Promise<void> {
    try {
      // Buscar dados da pré-matrícula
      const preEnrollment = await this.getPreEnrollment(id)
      if (!preEnrollment) {
        throw new Error('Pré-matrícula não encontrada')
      }

      // Atualizar status da pré-matrícula
      await updateDoc(doc(db, 'pre_enrollments', id), {
        status: 'aprovada',
        avaliadoPor: userId,
        dataDecisao: serverTimestamp() as Timestamp,
        atualizadoEm: serverTimestamp() as Timestamp
      })

      // Criar matrícula pendente a partir da pré-matrícula aprovada
      const { EnrollmentListService } = await import('./enrollment-list-service')
      await EnrollmentListService.createEnrollmentFromPreEnrollment(preEnrollment, userId)
    } catch (error) {
      console.error('Erro ao aprovar pré-matrícula:', error)
      throw new Error('Erro ao aprovar pré-matrícula')
    }
  }

  // Rejeitar pré-matrícula
  static async rejectPreEnrollment(id: string, motivoRejeicao: string, userId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'pre_enrollments', id), {
        status: 'rejeitada',
        motivoRejeicao,
        avaliadoPor: userId,
        dataDecisao: serverTimestamp() as Timestamp,
        atualizadoEm: serverTimestamp() as Timestamp
      })
    } catch (error) {
      console.error('Erro ao rejeitar pré-matrícula:', error)
      throw new Error('Erro ao rejeitar pré-matrícula')
    }
  }

  // Excluir pré-matrícula
  static async deletePreEnrollment(id: string): Promise<void> {
    try {
      // Deletar documento do Firestore
      await deleteDoc(doc(db, 'pre_enrollments', id))
    } catch (error) {
      console.error('Erro ao excluir pré-matrícula:', error)
      throw new Error('Erro ao excluir pré-matrícula')
    }
  }

  // Obter estatísticas do dashboard
  static async getStats(): Promise<PreEnrollmentStats> {
    try {
      const snapshot = await getDocs(collection(db, 'pre_enrollments'))
      
      let total = 0
      let emAnalise = 0
      let aprovadas = 0
      let rejeitadas = 0

      snapshot.forEach((doc) => {
        const data = doc.data()
        total++
        
        switch (data.status) {
          case 'analise':
            emAnalise++
            break
          case 'aprovada':
            aprovadas++
            break
          case 'rejeitada':
            rejeitadas++
            break
        }
      })

      return { total, emAnalise, aprovadas, rejeitadas }
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error)
      throw new Error('Erro ao obter estatísticas')
    }
  }
}
