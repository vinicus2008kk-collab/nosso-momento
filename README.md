# Nosso Momento

SaaS romântico para criação de páginas personalizadas do Dia dos Namorados com plano grátis e premium.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS (mobile-first)
- Prisma
- SQLite em dev / PostgreSQL em produção
- Mercado Pago Checkout Pro
- QR Code PNG

## Configuração

1. Copie o ambiente:

```bash
cp .env.example .env
```

2. Ajuste variáveis:

- `DATABASE_PROVIDER=sqlite` (dev) ou `postgresql` (produção)
- `DATABASE_URL`
- `NEXT_PUBLIC_APP_URL`
- `MERCADO_PAGO_ACCESS_TOKEN`

3. Instale dependências e rode migrations:

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
```

4. Rode o projeto:

```bash
npm run dev
```

## Rotas principais

- `/` landing page
- `/criar` formulário de criação
- `/momento/[slug]` página romântica pública
- `/checkout?pageId=...` checkout premium
- `/sucesso?pageId=...` sucesso com QR Code
- `/painel` painel simples para gerenciamento

## APIs

- `POST /api/romantic-pages` cria página
- `GET /api/romantic-pages` lista páginas
- `GET/PATCH /api/romantic-pages/[id]` consulta/edita
- `POST /api/checkout` inicia preferência Mercado Pago
- `POST /api/webhooks/mercadopago` webhook de pagamento
- `GET /api/qr/[slug]` gera QR Code PNG

## Regras de planos

### Grátis

- 1 foto
- mensagem simples
- contador de tempo juntos
- marca d'água

### Premium

- até 5 fotos
- música
- QR Code
- link personalizado
- animações e efeitos visuais
- botão surpresa
- sem marca d'água
