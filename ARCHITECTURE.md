Arquitetura

Camadas:
- `src/domain`: Tipos e regras puras. Funções: `computePromotionLikelihood`, `aggregateOkrProgress`.
- `src/application`: Serviços que orquestram dados e filtros.
- `src/infrastructure`: Adapters (JSON local em `data/*.json`) e rotas de API.
- `src/ui`: Componentes, páginas, tema.

Decisões:
- Dados mock em JSON para simplicidade e transparência na demo.
- App Router do Next.js para rotas e API embutida.
- Recharts para gráficos simples e responsivos.
- Zod para validação leve nas APIs.

Evolução:
- Substituir JSON por DB/ORM mantendo contratos da `application`.
- Adicionar cache e paginação nas rotas.

