# 🏫 Sistema de Gestão de Matrículas - Creche-Escola

Sistema web moderno para gestão de matrículas de creche-escola pública, desenvolvido com Next.js, TypeScript, Tailwind CSS e Firebase.

## 🚀 Funcionalidades

### ✅ Sistema de Autenticação
- **Login/Cadastro** com Firebase Authentication
- **Proteção de rotas** com AuthGuard
- **Dashboard** para usuários autenticados

### 📝 Cadastro de Matrículas
- **Formulário completo** com validação em tempo real
- **Dados do aluno**: Nome, data de nascimento, CPF, RG
- **Dados do responsável**: Nome, parentesco, contato
- **Endereço completo**: Logradouro, bairro, cidade, CEP
- **Dados socioeconômicos**: Raça/cor, faixa de renda, situação habitacional
- **Informações de deficiência**: Se possui e tipo (se aplicável)
- **Validações inteligentes**: CPF, email, idade (0-6 anos)

### 🎨 Interface Moderna
- **Design responsivo** com Tailwind CSS
- **Formulários estilizados** com feedback visual
- **Navegação intuitiva** e acessível
- **Mensagens de sucesso/erro** claras

### 🔧 Tecnologias Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication + Firestore)
- **Containerização**: Docker + Docker Compose
- **Validação**: Algoritmos customizados (CPF, email, etc.)

## 📋 Pré-requisitos

- Node.js 18+ 
- Docker e Docker Compose
- Conta no Firebase (opcional - sistema funciona com fallback local)

## 🛠️ Instalação e Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/creche-escola.git
cd creche-escola
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o Firebase (Opcional)
1. Crie um projeto no [Firebase Console](https://console.firebase.google.com)
2. Habilite Authentication e Firestore Database
3. Copie as credenciais para `src/lib/firebase.ts`
4. Configure as regras do Firestore usando o arquivo `firestore.rules`

### 4. Execute com Docker
```bash
# Construir e executar
docker-compose up --build

# Ou executar em background
docker-compose up --build -d
```

### 5. Acesse a aplicação
- **URL**: http://localhost:3000
- **Matrículas**: http://localhost:3000/matriculas

## 🐳 Docker

O projeto está completamente containerizado:

```bash
# Construir imagem
docker-compose build

# Executar container
docker-compose up

# Parar container
docker-compose down

# Ver logs
docker-compose logs -f
```

## 📁 Estrutura do Projeto

```
creche-escola/
├── src/
│   ├── app/                    # Páginas do Next.js
│   │   ├── dashboard/          # Dashboard do usuário
│   │   ├── login/              # Página de login
│   │   ├── signup/             # Página de cadastro
│   │   ├── matriculas/         # Página de matrículas
│   │   └── layout.tsx          # Layout principal
│   ├── components/             # Componentes React
│   │   ├── AuthForm.tsx        # Formulário de autenticação
│   │   ├── AuthGuard.tsx       # Proteção de rotas
│   │   ├── EnrollmentForm.tsx  # Formulário de matrícula
│   │   └── Navbar.tsx          # Barra de navegação
│   ├── hooks/                  # Custom hooks
│   │   └── useAuth.ts          # Hook de autenticação
│   ├── lib/                    # Configurações
│   │   └── firebase.ts         # Configuração do Firebase
│   └── utils/                  # Utilitários
│       └── validation.ts       # Funções de validação
├── docker-compose.yml          # Configuração do Docker
├── Dockerfile                  # Imagem Docker
├── firestore.rules            # Regras do Firestore
└── README.md                  # Este arquivo
```

## 🔐 Sistema de Fallback

O sistema possui um mecanismo inteligente de fallback:

1. **Primeira tentativa**: Salva no Firebase Firestore
2. **Se falhar**: Salva localmente no navegador (localStorage)
3. **Feedback**: Informa ao usuário onde os dados foram salvos

Isso garante que o sistema funcione mesmo sem configuração do Firebase.

## 🧪 Validações Implementadas

- **CPF**: Algoritmo completo de validação
- **Email**: Validação de formato
- **Idade**: Verificação de 0-6 anos para creche
- **Formatação automática**: CPF, telefone, CEP
- **Campos obrigatórios**: Validação em tempo real

## 🎯 Funcionalidades Futuras

- [ ] Painel administrativo para aprovação de matrículas
- [ ] Sistema de relatórios e estatísticas
- [ ] Notificações por email
- [ ] Upload de documentos
- [ ] Sistema de fila de espera
- [ ] Integração com sistemas governamentais

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Seu Nome** - *Desenvolvimento inicial* - [seu-github](https://github.com/seu-usuario)

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique as [Issues](https://github.com/seu-usuario/creche-escola/issues) existentes
2. Crie uma nova issue com detalhes do problema
3. Entre em contato: seu-email@exemplo.com

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework React
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Firebase](https://firebase.google.com/) - Backend as a Service
- [Docker](https://www.docker.com/) - Containerização

---

⭐ **Se este projeto foi útil para você, considere dar uma estrela!**