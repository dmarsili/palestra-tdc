Demo: Dashboard de KPIs/OKRs (TDC + IA)

Stack: Next.js (App Router) + TypeScript + Tailwind + Recharts + Zod.

Rodar localmente:

```bash
npm i
npm run dev
```

Build e testes:

```bash
npm run build
npm run start
npm run test
```

Camadas:
- `src/domain`: entidades e casos de uso puros
- `src/application`: serviços/orquestração
- `src/infrastructure`: dados JSON + rotas de API
- `src/ui`: componentes e páginas

Páginas:
- `/` Dashboard
- `/leaders` Lista
- `/leaders/[id]` Detalhes
- `/okr` OKRs
- `/about` Sobre
