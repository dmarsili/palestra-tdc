API

GET `/api/leaders?year=&company=`
- Retorna líderes (filtros opcionais).

GET `/api/leaders/:id`
- Retorna um líder.

GET `/api/kpis?leaderId=&year=`
- Retorna KPIs.

GET `/api/okrs`
- Retorna OKRs.

Os schemas seguem `src/domain/types.ts`. Validação básica com Zod em `src/infrastructure/api/validators.ts`.

