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
  Timestamp,
  setDoc
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { EnrollmentFormData, Enrollment } from '@/lib/enrollment-schemas'

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

// Tipos para documentos do Firestore
export interface FirestoreEnrollment {
  // Dados da criança
  nome: string
  identidade?: string
  dataNascimento: Timestamp
  sexo: string
  corRaca: string
  gemeos: boolean
  temIrmaosNaCreche: boolean
  nomeIrmaoNaCreche?: string
  numeroSUS?: string
  unidadeSaude?: string
  problemasSaude?: string
  restricaoAlimentar: boolean
  tipoRestricao?: string
  alergia: boolean
  tipoAlergia?: string
  mobilidadeReduzida: string
  possuiDeficienciasMultiplas: boolean
  tipoDeficiencia?: string
  publicoEducacaoEspecial: boolean
  tipoEducacaoEspecial?: string
  classificacao: string[]
  recebeAuxilioGoverno: boolean
  tipoAuxilio?: string
  numeroNIS?: string

  // Endereço
  logradouro: string
  numero: string
  pontoReferencia?: string
  bairro: string
  municipio: string
  uf: string
  cep: string
  telefoneResidencial?: string
  telefoneContato?: string

  // Documentos
  certidaoNascimento?: string
  municipioNascimento?: string
  municipioRegistro?: string
  cartorioRegistro?: string
  cpfCrianca?: string
  rgCrianca?: string
  dataEmissaoRg?: Timestamp
  orgaoEmissor?: string

  // Situação habitacional
  tipoOcupacao: string
  valorAluguel?: number
  numeroComodos: number
  tipoPiso: string
  tipoMoradia: string
  tipoCobertura: string
  saneamentoFossa: boolean
  saneamentoCifon: boolean
  energiaEletrica: boolean
  aguaEncanada: boolean

  // Bens
  tv: boolean
  dvd: boolean
  radio: boolean
  computador: boolean
  notebook: boolean
  telefoneFixo: boolean
  telefoneCelular: boolean
  tablet: boolean
  internet: boolean
  tvAssinatura: boolean
  fogao: boolean
  geladeira: boolean
  freezer: boolean
  microondas: boolean
  maquinaLavar: boolean
  arCondicionado: boolean
  bicicleta: boolean
  moto: boolean
  automovel: boolean

  // Informações escolares
  serie: string
  anoLetivo: string

  // Finalização
  dataMatricula: Timestamp
  aceiteDeclaracao: boolean
  assinaturaResponsavel: string

  // Metadados
  rendaFamiliarTotal: number
  rendaPerCapita: number
  criadoPor: string
  criadoEm: Timestamp
  atualizadoEm: Timestamp
  status: 'draft' | 'pending' | 'approved' | 'rejected'
}

export interface FirestoreGuardian {
  tipoResponsavel: string
  nome: string
  cpf?: string
  rg?: string
  celular?: string
  outroContato?: string
  localTrabalho?: string
}

export interface FirestoreFamilyMember {
  nomeMembro: string
  idade: number
  parentesco: string
  situacaoEscolar?: string
  situacaoEmprego?: string
  rendimentoDescricao?: string
  valorBruto: number
}

export interface FirestoreAuthorizedPerson {
  nome: string
  parentesco: string
  rg?: string
  telefone?: string
}

export interface FirestoreHistoryEntry {
  action: 'created' | 'updated' | 'approved' | 'rejected' | 'deleted'
  changedBy: string
  changedAt: Timestamp
  changesDiff?: any
  notes?: string
}

// Função para converter dados do formulário para formato do Firestore
export function convertFormDataToFirestore(data: EnrollmentFormData, userId: string): FirestoreEnrollment {
  const step1 = data.step1
  const step2 = data.step2
  const step3 = data.step3
  const step4 = data.step4
  const step5 = data.step5
  const step6 = data.step6
  const step7 = data.step7

  // Calcular renda familiar
  const rendaFamiliarTotal = step5.members.reduce((sum, member) => sum + member.valorBruto, 0)
  const rendaPerCapita = step5.members.length > 0 ? rendaFamiliarTotal / step5.members.length : 0

  return {
    // Dados da criança
    nome: step1.nome,
    identidade: step1.identidade,
    dataNascimento: Timestamp.fromDate(step1.dataNascimento),
    sexo: step1.sexo,
    corRaca: step1.corRaca,
    gemeos: step1.gemeos,
    temIrmaosNaCreche: step1.temIrmaosNaCreche,
    nomeIrmaoNaCreche: step1.nomeIrmaoNaCreche,
    numeroSUS: step1.numeroSUS,
    unidadeSaude: step1.unidadeSaude,
    problemasSaude: step1.problemasSaude,
    restricaoAlimentar: step1.restricaoAlimentar,
    tipoRestricao: step1.tipoRestricao,
    alergia: step1.alergia,
    tipoAlergia: step1.tipoAlergia,
    mobilidadeReduzida: step1.mobilidadeReduzida,
    possuiDeficienciasMultiplas: step1.possuiDeficienciasMultiplas,
    tipoDeficiencia: step1.tipoDeficiencia,
    publicoEducacaoEspecial: step1.publicoEducacaoEspecial,
    tipoEducacaoEspecial: step1.tipoEducacaoEspecial,
    classificacao: step1.classificacao,
    recebeAuxilioGoverno: step1.recebeAuxilioGoverno,
    tipoAuxilio: step1.tipoAuxilio,
    numeroNIS: step1.numeroNIS,

    // Endereço
    logradouro: step3.logradouro,
    numero: step3.numero,
    pontoReferencia: step3.pontoReferencia,
    bairro: step3.bairro,
    municipio: step3.municipio,
    uf: step3.uf,
    cep: step3.cep,
    telefoneResidencial: step3.telefoneResidencial,
    telefoneContato: step3.telefoneContato,

    // Documentos
    certidaoNascimento: step3.certidaoNascimento,
    municipioNascimento: step3.municipioNascimento,
    municipioRegistro: step3.municipioRegistro,
    cartorioRegistro: step3.cartorioRegistro,
    cpfCrianca: step3.cpfCrianca,
    rgCrianca: step3.rgCrianca,
    dataEmissaoRg: step3.dataEmissaoRg ? Timestamp.fromDate(step3.dataEmissaoRg) : undefined,
    orgaoEmissor: step3.orgaoEmissor,

    // Situação habitacional
    tipoOcupacao: step4.tipoOcupacao,
    valorAluguel: step4.valorAluguel,
    numeroComodos: step4.numeroComodos,
    tipoPiso: step4.tipoPiso,
    tipoMoradia: step4.tipoMoradia,
    tipoCobertura: step4.tipoCobertura,
    saneamentoFossa: step4.saneamentoFossa,
    saneamentoCifon: step4.saneamentoCifon,
    energiaEletrica: step4.energiaEletrica,
    aguaEncanada: step4.aguaEncanada,

    // Bens
    tv: step4.tv,
    dvd: step4.dvd,
    radio: step4.radio,
    computador: step4.computador,
    notebook: step4.notebook,
    telefoneFixo: step4.telefoneFixo,
    telefoneCelular: step4.telefoneCelular,
    tablet: step4.tablet,
    internet: step4.internet,
    tvAssinatura: step4.tvAssinatura,
    fogao: step4.fogao,
    geladeira: step4.geladeira,
    freezer: step4.freezer,
    microondas: step4.microondas,
    maquinaLavar: step4.maquinaLavar,
    arCondicionado: step4.arCondicionado,
    bicicleta: step4.bicicleta,
    moto: step4.moto,
    automovel: step4.automovel,

    // Informações escolares
    serie: step6.serie,
    anoLetivo: step6.anoLetivo,

    // Finalização
    dataMatricula: Timestamp.fromDate(step7.dataMatricula),
    aceiteDeclaracao: step7.aceiteDeclaracao,
    assinaturaResponsavel: step7.assinaturaResponsavel,

    // Metadados
    rendaFamiliarTotal,
    rendaPerCapita,
    criadoPor: userId,
    criadoEm: serverTimestamp() as Timestamp,
    atualizadoEm: serverTimestamp() as Timestamp,
    status: 'pending'
  }
}

// Serviços para operações CRUD
export class EnrollmentService {
  // Criar nova matrícula
  static async createEnrollment(data: EnrollmentFormData, userId: string): Promise<string> {
    try {
      const enrollmentData = convertFormDataToFirestore(data, userId)
      
      // Limpar valores undefined antes de enviar para o Firestore
      const cleanedData = cleanUndefinedValues(enrollmentData)
      
      // Criar documento principal
      const enrollmentRef = await addDoc(collection(db, 'enrollments'), cleanedData)
      const enrollmentId = enrollmentRef.id

      // Criar subcoleções
      await this.createSubcollections(enrollmentId, data)

      // Criar entrada no histórico
      await this.addHistoryEntry(enrollmentId, 'created', userId, 'Matrícula criada')

      return enrollmentId
    } catch (error) {
      console.error('Erro ao criar matrícula:', error)
      throw new Error('Erro ao criar matrícula')
    }
  }

  // Atualizar matrícula existente
  static async updateEnrollment(enrollmentId: string, data: EnrollmentFormData, userId: string): Promise<void> {
    try {
      const enrollmentData = convertFormDataToFirestore(data, userId)
      
      // Limpar valores undefined antes de enviar para o Firestore
      const cleanedData = cleanUndefinedValues(enrollmentData)
      cleanedData.atualizadoEm = serverTimestamp() as Timestamp

      // Atualizar documento principal
      await updateDoc(doc(db, 'enrollments', enrollmentId), cleanedData as any)

      // Atualizar subcoleções
      await this.updateSubcollections(enrollmentId, data)

      // Adicionar entrada no histórico
      await this.addHistoryEntry(enrollmentId, 'updated', userId, 'Matrícula atualizada')
    } catch (error) {
      console.error('Erro ao atualizar matrícula:', error)
      throw new Error('Erro ao atualizar matrícula')
    }
  }

  // Buscar matrícula por ID
  static async getEnrollment(enrollmentId: string): Promise<FirestoreEnrollment | null> {
    try {
      const enrollmentDoc = await getDoc(doc(db, 'enrollments', enrollmentId))
      
      if (!enrollmentDoc.exists()) {
        return null
      }

      return enrollmentDoc.data() as FirestoreEnrollment
    } catch (error) {
      console.error('Erro ao buscar matrícula:', error)
      throw new Error('Erro ao buscar matrícula')
    }
  }

  // Listar matrículas com filtros
  static async listEnrollments(filters?: {
    status?: string
    corRaca?: string
    bairro?: string
    municipio?: string
    anoLetivo?: string
    serie?: string
    limit?: number
  }): Promise<FirestoreEnrollment[]> {
    try {
      let q = query(collection(db, 'enrollments'), orderBy('criadoEm', 'desc'))

      if (filters?.status) {
        q = query(q, where('status', '==', filters.status))
      }
      if (filters?.corRaca) {
        q = query(q, where('corRaca', '==', filters.corRaca))
      }
      if (filters?.bairro) {
        q = query(q, where('bairro', '==', filters.bairro))
      }
      if (filters?.municipio) {
        q = query(q, where('municipio', '==', filters.municipio))
      }
      if (filters?.anoLetivo) {
        q = query(q, where('anoLetivo', '==', filters.anoLetivo))
      }
      if (filters?.serie) {
        q = query(q, where('serie', '==', filters.serie))
      }
      if (filters?.limit) {
        q = query(q, limit(filters.limit))
      }

      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => doc.data() as FirestoreEnrollment)
    } catch (error) {
      console.error('Erro ao listar matrículas:', error)
      throw new Error('Erro ao listar matrículas')
    }
  }

  // Deletar matrícula
  static async deleteEnrollment(enrollmentId: string, userId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'enrollments', enrollmentId))
      await this.addHistoryEntry(enrollmentId, 'deleted', userId, 'Matrícula deletada')
    } catch (error) {
      console.error('Erro ao deletar matrícula:', error)
      throw new Error('Erro ao deletar matrícula')
    }
  }

  // Criar subcoleções
  private static async createSubcollections(enrollmentId: string, data: EnrollmentFormData): Promise<void> {
    const batch = []

    // Responsáveis
    for (const guardian of data.step2.guardians) {
      batch.push(addDoc(collection(db, 'enrollments', enrollmentId, 'guardians'), guardian))
    }

    // Composição familiar
    for (const member of data.step5.members) {
      batch.push(addDoc(collection(db, 'enrollments', enrollmentId, 'familyComposition'), member))
    }

    // Pessoas autorizadas
    for (const person of data.step6.authorizedPersons) {
      batch.push(addDoc(collection(db, 'enrollments', enrollmentId, 'authorizedPersons'), person))
    }

    await Promise.all(batch)
  }

  // Atualizar subcoleções
  private static async updateSubcollections(enrollmentId: string, data: EnrollmentFormData): Promise<void> {
    // Deletar subcoleções existentes e recriar
    // (Simplificação - em produção seria melhor fazer update incremental)
    
    // Responsáveis
    const guardiansSnapshot = await getDocs(collection(db, 'enrollments', enrollmentId, 'guardians'))
    for (const guardianDoc of guardiansSnapshot.docs) {
      await deleteDoc(guardianDoc.ref)
    }
    for (const guardian of data.step2.guardians) {
      await addDoc(collection(db, 'enrollments', enrollmentId, 'guardians'), guardian)
    }

    // Composição familiar
    const familySnapshot = await getDocs(collection(db, 'enrollments', enrollmentId, 'familyComposition'))
    for (const memberDoc of familySnapshot.docs) {
      await deleteDoc(memberDoc.ref)
    }
    for (const member of data.step5.members) {
      await addDoc(collection(db, 'enrollments', enrollmentId, 'familyComposition'), member)
    }

    // Pessoas autorizadas
    const authorizedSnapshot = await getDocs(collection(db, 'enrollments', enrollmentId, 'authorizedPersons'))
    for (const personDoc of authorizedSnapshot.docs) {
      await deleteDoc(personDoc.ref)
    }
    for (const person of data.step6.authorizedPersons) {
      await addDoc(collection(db, 'enrollments', enrollmentId, 'authorizedPersons'), person)
    }
  }

  // Adicionar entrada no histórico
  static async addHistoryEntry(
    enrollmentId: string, 
    action: FirestoreHistoryEntry['action'], 
    userId: string, 
    notes?: string
  ): Promise<void> {
    try {
      await addDoc(collection(db, 'enrollments', enrollmentId, 'history'), {
        action,
        changedBy: userId,
        changedAt: serverTimestamp(),
        notes
      })
    } catch (error) {
      console.error('Erro ao adicionar entrada no histórico:', error)
    }
  }

  // Buscar histórico de uma matrícula
  static async getEnrollmentHistory(enrollmentId: string): Promise<FirestoreHistoryEntry[]> {
    try {
      const historySnapshot = await getDocs(
        query(collection(db, 'enrollments', enrollmentId, 'history'), orderBy('changedAt', 'desc'))
      )
      
      return historySnapshot.docs.map(doc => doc.data() as FirestoreHistoryEntry)
    } catch (error) {
      console.error('Erro ao buscar histórico:', error)
      throw new Error('Erro ao buscar histórico')
    }
  }

  // Salvar rascunho
  static async saveDraft(userId: string, draftId: string, data: Partial<EnrollmentFormData>): Promise<void> {
    try {
      console.log('Tentando salvar rascunho:', { userId, draftId, data })
      
      // Usar estrutura com número par de segmentos: enrollments_drafts/{draftId}
      await setDoc(doc(db, 'enrollments_drafts', draftId), {
        userId,
        draftId,
        data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      
      console.log('Rascunho salvo com sucesso!')
    } catch (error) {
      console.error('Erro detalhado ao salvar rascunho:', error)
      console.error('Tipo do erro:', typeof error)
      console.error('Mensagem do erro:', error instanceof Error ? error.message : 'Erro desconhecido')
      throw new Error('Erro ao salvar rascunho')
    }
  }

  // Buscar rascunhos do usuário
  static async getUserDrafts(userId: string): Promise<any[]> {
    try {
      const draftsSnapshot = await getDocs(
        query(
          collection(db, 'enrollments_drafts'),
          where('userId', '==', userId),
          orderBy('updatedAt', 'desc')
        )
      )
      return draftsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Erro ao buscar rascunhos:', error)
      throw new Error('Erro ao buscar rascunhos')
    }
  }
}
