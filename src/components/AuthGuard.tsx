'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ApprovalStatus from './ApprovalStatus';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, userProfile, loading, isApproved } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecionando...</p>
        </div>
      </div>
    );
  }

  // Se o usuário não está aprovado, mostrar status de aprovação
  if (!isApproved && userProfile) {
    return (
      <ApprovalStatus 
        status={userProfile.status || 'pending'}
        userProfile={{
          nomeCompleto: userProfile.nomeCompleto,
          email: userProfile.email || '',
          cargo: 'Funcionário' // TODO: Buscar cargo do Firestore
        }}
      />
    );
  }

  return <>{children}</>;
}
