'use client';

import { useAuth } from '@/hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <nav className="bg-primary-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Creche-Escola
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link href="/matriculas" className="hover:text-primary-200">
            Matrículas
          </Link>
          {user ? (
            <>
              <span className="text-sm">
                Olá, {user.email}
              </span>
              <Link href="/dashboard" className="hover:text-primary-200">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-primary-700 hover:bg-primary-800 px-3 py-1 rounded text-sm"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-primary-200">
                Entrar
              </Link>
              <Link href="/signup" className="bg-primary-700 hover:bg-primary-800 px-3 py-1 rounded">
                Cadastrar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
