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

## 🖼️ Screenshots

### Dashboard
⚒️Em desenvolvimento⚒️

### Página de Login
<img width="1898" height="911" alt="image" src="https://github.com/user-attachments/assets/33cc3ac5-f0fb-4aee-9e90-a6e4f847fd5e" />

### Página de Cadastro
<img width="1896" height="909" alt="image" src="https://github.com/user-attachments/assets/a5a78304-2e23-4cad-a787-fc3888479ed4" />

### Pré-Matrículas - Listagem
<img width="1900" height="910" alt="image" src="https://github.com/user-attachments/assets/c527c164-63a7-4f2d-bd29-5bed1fc13643" />
<img width="1734" height="876" alt="image" src="https://github.com/user-attachments/assets/18c96cc2-60f8-444c-aaf6-8441c29aab7f" />

### Pré-Matrículas - Formulário
<img width="1892" height="908" alt="image" src="https://github.com/user-attachments/assets/6970c495-41ee-49de-adee-5154e29ce3f1" />
<img width="1891" height="907" alt="image" src="https://github.com/user-attachments/assets/1f36dcc9-7fe2-4b6f-b952-9dd9b273015d" />

### Matrículas - Listagem
<img width="1896" height="914" alt="image" src="https://github.com/user-attachments/assets/f6e2a06c-5837-4a0f-a4ac-858bae5b2b7c" />

### Matrículas - Formulário
<img width="1898" height="910" alt="image" src="https://github.com/user-attachments/assets/75091e26-8e4e-4b7b-9e5a-8ba1970d6ac5" />
<img width="1896" height="909" alt="image" src="https://github.com/user-attachments/assets/96e6622a-dbd0-4bf1-a6d1-c686bd9aa69e" />
<img width="1896" height="909" alt="image" src="https://github.com/user-attachments/assets/a468c9f7-d69a-4c7a-9cbc-f219faffb910" />
<img width="1896" height="916" alt="image" src="https://github.com/user-attachments/assets/ecd3dcd2-1603-4517-b797-ef81397aac4e" />
<img width="1887" height="908" alt="image" src="https://github.com/user-attachments/assets/29f165a1-3aad-4526-97ad-20cca5e59d38" />
<img width="1894" height="912" alt="image" src="https://github.com/user-attachments/assets/0de8774d-3227-458f-9a64-70ff7a3f4bad" />
<img width="1895" height="908" alt="image" src="https://github.com/user-attachments/assets/f6dadfd6-f558-42bc-ab77-31668c6bfff6" />
<img width="1892" height="904" alt="image" src="https://github.com/user-attachments/assets/cf364be3-f250-4573-9fdd-39aaac25bcf5" />
<img width="1893" height="908" alt="image" src="https://github.com/user-attachments/assets/6cf7b05b-57bb-438f-98e5-a8cc102fb7b6" />
<img width="1898" height="911" alt="image" src="https://github.com/user-attachments/assets/df0436ed-e8ce-40c9-bee9-c7ec6eef784f" />
<img width="1896" height="910" alt="image" src="https://github.com/user-attachments/assets/01d9c4b2-ad26-4213-8822-73d5f13c5a24" />
<img width="1896" height="912" alt="image" src="https://github.com/user-attachments/assets/8eded08c-1f85-4f08-aa77-ab15688b02b1" />
<img width="1898" height="913" alt="image" src="https://github.com/user-attachments/assets/f035e191-c206-4328-b627-c265ac4c0d4b" />

### Rematrículas
⚒️Em desenvolvimento⚒

### Usuários
<img width="1896" height="906" alt="image" src="https://github.com/user-attachments/assets/bf3e866b-88dc-4b42-8bdf-cb6fc814147b" />
<img width="1895" height="912" alt="image" src="https://github.com/user-attachments/assets/77d4b438-9e2a-44b9-b25b-fc98af39634e" />

#### Usuário aguardando aprovação
<img width="1893" height="912" alt="image" src="https://github.com/user-attachments/assets/fa166d73-4245-4f82-88d5-ffe27928bf83" />

### Relatórios
⚒️Em desenvolvimento⚒


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
