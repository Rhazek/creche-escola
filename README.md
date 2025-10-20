# 🎓 Creche Estrela do Oriente - Sistema de Gestão

Sistema completo de gestão para creche pública desenvolvido com Next.js 14, Firebase e TailwindCSS.

## 🚀 Tecnologias

- **Next.js 14** (App Router)
- **TypeScript**
- **Firebase** (Authentication, Firestore, Storage)
- **TailwindCSS**
- **React Hook Form** + **Zod**
- **Lucide React** (Ícones)

## 📋 Funcionalidades

### 🔐 Autenticação e Autorização
- Sistema de login e cadastro
- Aprovação de usuários por administradores
- Controle de acesso baseado em perfis (Funcionário/Administrador)

### 📝 Módulos Principais

#### 1. **Pré-Matrículas**
- Cadastro de solicitações de pré-matrícula
- Dashboard com estatísticas (Em Análise, Aprovadas, Rejeitadas)
- Aprovação/Rejeição de solicitações
- Filtros avançados

#### 2. **Matrículas**
- Listagem de matrículas (Pendentes, Confirmadas, Canceladas)
- Integração automática com pré-matrículas aprovadas
- Formulário completo de matrícula em 7 etapas
- Gestão de responsáveis, endereço, documentos, composição familiar

#### 3. **Usuários**
- Gerenciamento de usuários do sistema
- Aprovação de novos cadastros
- Edição de permissões

#### 4. **Relatórios**
- Dashboard com estatísticas gerais
- Visualização de dados consolidados

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd creche-escola
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
# Crie um arquivo .env.local com as configurações do Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Execute o projeto:
```bash
npm run dev
```

Acesse: http://localhost:3000

## 🔥 Firebase Setup

### Firestore Rules
As regras de segurança estão configuradas em `firestore.rules`. Atualize-as no Firebase Console.

### Storage Rules
As regras de storage estão em `storage.rules`. Configure-as no Firebase Console.

## 📦 Estrutura do Projeto

```
src/
├── app/                    # Páginas Next.js
│   ├── login/             # Página de login
│   ├── signup/            # Página de cadastro
│   ├── dashboard/         # Dashboard principal
│   ├── pre-matriculas/    # Módulo de pré-matrículas
│   ├── matriculas/        # Módulo de matrículas
│   └── aprovacao/         # Gestão de usuários
├── components/            # Componentes React
│   ├── EnrollmentForm/    # Formulário de matrícula
│   ├── layout/            # Layout e Sidebar
│   └── ui/                # Componentes UI reutilizáveis
├── lib/                   # Serviços e utilitários
│   ├── firebase.ts        # Configuração Firebase
│   ├── enrollment-service.ts
│   └── pre-enrollment-service.ts
└── hooks/                 # Custom hooks
```

## 🎨 Identidade Visual

- **Nome:** Creche Estrela do Oriente
- **Cor Principal:** Verde #0d833a
- **Logo:** Estrela amarela com rosto feliz

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👥 Contribuição

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request.

---

Desenvolvido com ❤️ para a Creche Estrela do Oriente