# ⚡ LampStore

> Crie seu catálogo online e venda pelo WhatsApp em minutos.

LampStore é uma plataforma SaaS completa onde influenciadores, criadores de conteúdo e pequenos vendedores podem criar uma página de catálogo de produtos e vender diretamente pelo WhatsApp.

## ✨ Funcionalidades

- **Loja pública** com URL personalizada (`lampstore.com/suanome`)
- **Catálogo de produtos** com fotos, preços e descrições
- **Compra pelo WhatsApp** com mensagem automática gerada
- **Carrinho para WhatsApp** — cliente adiciona vários produtos e envia de uma vez
- **Dashboard completo** — gerencie sua loja e produtos
- **Analytics** — veja visitas e cliques no WhatsApp
- **Tema personalizável** — escolha as cores da sua loja
- **SEO** — páginas com metadata dinâmica
- **Mobile first** — design otimizado para celular
- **Plano gratuito** — até 5 produtos, ideal para começar

## 🛠 Stack

- **Next.js 15** com App Router
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Auth + PostgreSQL + Storage)
- **Server Actions**
- **React Server Components**

## 🚀 Como rodar localmente

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no [Supabase](https://supabase.com)

### 1. Clone e instale dependências

```bash
git clone https://github.com/seu-usuario/lampstore.git
cd lampstore
npm install
```

### 2. Configure o Supabase

1. Crie um novo projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor** e execute o conteúdo de `supabase/schema.sql`
3. Vá em **Storage** e crie um bucket chamado `product-images` com acesso público
4. Adicione as políticas de storage (veja comentários no final do `schema.sql`)

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencha o `.env.local` com suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Você encontra essas chaves em: **Supabase Dashboard → Settings → API**

### 4. Configure o Storage

No Supabase Dashboard:
1. Vá em **Storage**
2. Clique em **New bucket**
3. Nome: `product-images`
4. Marque **Public bucket**
5. Clique em **Create bucket**

Depois adicione as políticas de acesso via SQL Editor:

```sql
-- Qualquer pessoa pode ver as imagens
create policy "Anyone can view product images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

-- Usuários autenticados podem fazer upload
create policy "Authenticated users can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

-- Usuários autenticados podem atualizar imagens
create policy "Authenticated users can update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images');

-- Usuários autenticados podem deletar imagens
create policy "Authenticated users can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');
```

### 5. Rode o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 🔧 Configuração do Supabase Auth

No Supabase Dashboard:
1. Vá em **Authentication → URL Configuration**
2. Adicione `http://localhost:3000/auth/callback` em **Redirect URLs**
3. Para produção, adicione também `https://seudominio.com/auth/callback`

## 📦 Estrutura do Projeto

```
/app
  /(auth)          # Páginas de login e cadastro
    /login
    /signup
  /dashboard       # Dashboard do vendedor (protegido)
    /products      # Gerenciar produtos
    /analytics     # Ver estatísticas
    /settings      # Configurações da loja
  /[store]         # Página pública da loja
    /[product]     # Página de produto individual
  /auth/callback   # Callback OAuth do Supabase

/components
  /dashboard       # Componentes do dashboard
  /store           # Componentes da loja pública
  /ui              # Componentes de UI reutilizáveis

/lib
  /actions         # Server Actions (auth, stores, products, analytics)
  /supabase        # Clientes Supabase (browser, server, middleware)
  /utils.ts        # Funções utilitárias

/types
  /index.ts        # Tipos TypeScript

/supabase
  /schema.sql      # Schema do banco de dados
```

## 🌐 Deploy na Vercel

### 1. Faça push para o GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/seu-usuario/lampstore.git
git push -u origin main
```

### 2. Importe na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **New Project**
3. Importe seu repositório do GitHub
4. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (seu domínio Vercel, ex: `https://lampstore.vercel.app`)
5. Clique em **Deploy**

### 3. Configure o domínio personalizado (opcional)

Em **Vercel → Project → Settings → Domains**, adicione seu domínio.

Depois atualize em **Supabase → Authentication → URL Configuration** com o novo domínio.

## 📊 Banco de Dados

### Tabelas

| Tabela | Descrição |
|--------|-----------|
| `users` | Espelha `auth.users` do Supabase |
| `stores` | Lojas dos vendedores |
| `products` | Produtos das lojas |
| `analytics` | Eventos de visitas e cliques |

### Diagrama simplificado

```
users (1) ──── (N) stores (1) ──── (N) products
                     │
                     └──── (N) analytics
```

## 🔐 Segurança

- Row Level Security (RLS) habilitado em todas as tabelas
- Usuários só podem modificar seus próprios dados
- Páginas públicas são read-only para anônimos
- Analytics pode ser inserido por qualquer pessoa (rastreamento de visitas)

## 🗺 Roadmap

- [ ] Plano Pro com produtos ilimitados
- [ ] Domínio personalizado
- [ ] Analytics avançado com gráficos
- [ ] Pagamento integrado (Pix, cartão)
- [ ] Variações de produto (tamanho, cor)
- [ ] Categorias de produtos
- [ ] Integração com Instagram Shopping

## 📄 Licença

MIT License — veja [LICENSE](LICENSE) para detalhes.

---

Feito com ❤️ no Brasil 🇧🇷
