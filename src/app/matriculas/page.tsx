import EnrollmentForm from '@/components/EnrollmentForm';

export const metadata = {
  title: 'Cadastro de Matrículas - Creche-Escola',
  description: 'Sistema de cadastro de matrículas para creche-escola pública',
};

export default function MatriculasPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Cadastro de Matrículas
          </h1>
          <p className="text-gray-600">
            Preencha o formulário abaixo para realizar a matrícula do aluno
          </p>
        </div>
        
        <EnrollmentForm />
        
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Informações Importantes
          </h3>
          <ul className="text-blue-700 space-y-1 text-sm">
            <li>• Todos os campos marcados com * são obrigatórios</li>
            <li>• Após o cadastro, a matrícula será analisada pela equipe pedagógica</li>
            <li>• Você receberá um retorno sobre o status da matrícula em até 5 dias úteis</li>
            <li>• Em caso de dúvidas, entre em contato conosco</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
