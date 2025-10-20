'use client'

import { useState, useEffect } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

interface UserProfile {
  uid: string
  email: string | null
  nomeCompleto: string
  cpf: string
  perfil: 'funcionario' | 'administrador'
  status?: 'pending' | 'approved' | 'rejected'
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isApproved, setIsApproved] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user?.email)
      setUser(user)
      
      if (user) {
        try {
          console.log('🔍 Verificando status do usuário:', user.uid)
          
          // Verificar se está na coleção usuarios (usuários aprovados)
          const userDoc = await getDoc(doc(db, 'usuarios', user.uid))
          
          if (userDoc.exists()) {
            const userData = userDoc.data()
            console.log('✅ Usuário encontrado em usuarios (aprovado):', userData)
            
            const profile = {
              uid: user.uid,
              email: user.email,
              nomeCompleto: userData.nomeCompleto || user.email || 'Usuário',
              cpf: userData.cpf || '',
              perfil: (userData.perfil || 'funcionario') as 'funcionario' | 'administrador',
              status: 'approved' as 'pending' | 'approved' | 'rejected'
            }
            
            setUserProfile(profile)
            setIsApproved(true)
            localStorage.setItem('userProfile', JSON.stringify(profile))
            console.log('🎉 Usuário aprovado e configurado!')
          } else {
            // Verificar se está na coleção de usuários pendentes
            const pendingDoc = await getDoc(doc(db, 'usuarios_pendentes', user.uid))
            
            if (pendingDoc.exists()) {
              const pendingData = pendingDoc.data()
              console.log('⏳ Usuário encontrado em usuarios_pendentes:', pendingData)
              
              const profile = {
                uid: user.uid,
                email: user.email,
                nomeCompleto: pendingData.nomeCompleto || user.email || 'Usuário',
                cpf: pendingData.cpf || '',
                perfil: 'funcionario',
                status: pendingData.status || 'pending'
              }
              
              setUserProfile(profile)
              setIsApproved(false)
              localStorage.setItem('userProfile', JSON.stringify(profile))
            } else {
              console.log('❌ Usuário não encontrado em nenhuma coleção')
              // Criar perfil padrão se não existir
              const defaultProfile = {
                uid: user.uid,
                email: user.email,
                nomeCompleto: user.email || 'Usuário',
                cpf: '',
                perfil: 'funcionario' as 'funcionario' | 'administrador',
                status: 'pending' as 'pending' | 'approved' | 'rejected'
              }
              localStorage.setItem('userProfile', JSON.stringify(defaultProfile))
              setUserProfile(defaultProfile)
              setIsApproved(false)
            }
          }
        } catch (error) {
          console.error('Erro ao verificar status do usuário:', error)
          // Fallback para localStorage
          const profile = localStorage.getItem('userProfile')
          if (profile) {
            try {
              const parsedProfile = JSON.parse(profile)
              setUserProfile(parsedProfile)
              setIsApproved(parsedProfile.status === 'approved')
            } catch (e) {
              console.error('Erro ao carregar perfil do localStorage:', e)
            }
          }
        }
      } else {
        setUserProfile(null)
        setIsApproved(false)
        localStorage.removeItem('userProfile')
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Função para verificar se o usuário tem permissão de administrador
  const isAdmin = () => {
    return userProfile?.perfil === 'administrador' && isApproved
  }

  // Função para verificar se o usuário tem permissão de funcionário
  const isEmployee = () => {
    return (userProfile?.perfil === 'funcionario' || userProfile?.perfil === 'administrador') && isApproved
  }

  return { 
    user, 
    userProfile, 
    loading, 
    isAdmin, 
    isEmployee,
    isApproved
  }
}