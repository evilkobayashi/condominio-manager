# condominio-manager

Sistema de gestão para síndicos de condomínios — controle de unidades, cobranças, inadimplência e comunicados.

## Problema real

Síndicos de pequenos condomínios não têm budget para sistemas pagos e gerenciam tudo em planilhas ou WhatsApp. Perdem controle de quem está em dia, não conseguem enviar comunicados organizados.

## Stack

- Next.js 14 + TypeScript
- Prisma ORM + SQLite
- REST API

## Funcionalidades

- Cadastro de unidades com dados do proprietário
- Lançamento de cobranças (condomínio, fundo de obras, multas)
- Controle de status: pendente / pago / atrasado
- Mural de comunicados com prioridade

## Instalação

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

## Modelo

```
Unit (apartamento)
  └── Charge (cobrança mensal, taxa extra, multa)

Notice (comunicados do síndico)
```

## API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET/POST | /api/units | Unidades |
| GET/POST | /api/charges | Cobranças |
| GET/POST | /api/notices | Comunicados |
