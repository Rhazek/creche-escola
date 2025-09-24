import AuthForm from '@/components/AuthForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full">
        <AuthForm mode="login" />
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Não tem uma conta?{' '}
            <Link href="/signup" className="text-primary-600 hover:text-primary-800 font-medium">
              Cadastre-se aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}