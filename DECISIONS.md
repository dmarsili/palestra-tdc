Decisões (ADR curto)

1) JSON local vs. DB
- Escolhemos JSON em `src/infrastructure/data/*.json` para velocidade e clareza em demo.
- Fácil de trocar por DB/ORM mantendo contratos da camada `application`.

2) Next.js App Router
- Simplicidade para expor rotas de API e páginas numa única base.
- Facilita streaming e organização em pastas.

3) Recharts
- API simples, boa para protótipos e dashboards.

4) Zod
- Validação leve, tipada, sem dependências de runtime pesadas.

