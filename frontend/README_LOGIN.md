# Tela de Login - Embarka

## 📋 Descrição

Tela de login responsiva e profissional desenvolvida para a plataforma Embarka, seguindo as melhores práticas de UX/UI e utilizando a identidade visual da marca.

## 🎨 Design System

### Cores da Marca
- **Verde Principal**: #22c55e (usado no "k" do logo e elementos interativos)
- **Preto**: #171717 (usado no texto do logo)
- **Gradientes**: Verde para elementos de destaque

### Psicologia das Cores Aplicada
- **Verde**: Transmite confiança, crescimento, estabilidade e segurança
- **Branco/Cinza Claro**: Transmite limpeza, profissionalismo e simplicidade
- **Gradientes**: Criam sensação de movimento e modernidade

## 🏗️ Arquitetura dos Componentes

### Atomic Design Pattern
```
src/components/
├── atoms/           # Componentes básicos reutilizáveis
│   ├── Logo.tsx    # Logo da Embarka com variações de tamanho
│   ├── Input.tsx   # Input com validação e ícones
│   └── Button.tsx  # Botão com variações e estados
├── molecules/       # Combinações de átomos
│   └── LoginForm.tsx # Formulário completo de login
└── templates/       # Layout completo da página
    └── LoginTemplate.tsx # Template responsivo da tela
```

## 🚀 Funcionalidades

### Validação de Formulário
- Validação em tempo real
- Mensagens de erro claras
- Feedback visual imediato

### Segurança
- Mostrar/ocultar senha
- Validação de formato de email
- Proteção contra envios múltiplos

### Responsividade
- Design mobile-first
- Layout adaptativo para desktop
- Pontos de quebra otimizados

### Acessibilidade
- Labels apropriados
- Navegação por teclado
- Contraste adequado
- Estados de foco visíveis

## 🔧 Como Usar

### Navegação
Acesse a tela de login através da rota: `/login`

### Credenciais de Teste
- **Email**: admin@embarka.com
- **Senha**: 123456

### Rotas Disponíveis
- `/` - Página inicial (Wellcome)
- `/login` - Tela de login
- `/dashboard` - Dashboard (após login)

## 📱 Responsividade

### Mobile (< 768px)
- Layout single-column
- Formulário centralizado
- Features ocultas para otimizar espaço

### Desktop (≥ 1024px)
- Layout split-screen
- Lado esquerdo: Formulário
- Lado direito: Features e benefícios

## 🎯 Boas Práticas Implementadas

### Clean Code
- Componentes pequenos e focados
- Nomes descritivos
- Separação de responsabilidades
- Tipagem TypeScript completa

### Performance
- Lazy loading de componentes
- Otimização de re-renders
- Debounce em validações

### UX/UI
- Loading states claros
- Feedback de ações
- Microinterações suaves
- Hierarquia visual clara

## 🔮 Próximos Passos

- [ ] Integração com API real
- [ ] Autenticação 2FA
- [ ] Login social (Google, Microsoft)
- [ ] Recuperação de senha
- [ ] Tema escuro
- [ ] Testes automatizados

## 🛠️ Tecnologias Utilizadas

- **React 19** - Framework frontend
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Lucide React** - Ícones modernos
- **React Router** - Roteamento
- **React Toastify** - Notificações

---

*"É Ver, Prever, Agir e Entregar."* - Embarka