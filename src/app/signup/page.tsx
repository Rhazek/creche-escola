import AuthForm from '../../components/AuthForm';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full">
        <AuthForm mode="signup" />
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-primary-600 hover:text-primary-800 font-medium">
              Faça login aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}