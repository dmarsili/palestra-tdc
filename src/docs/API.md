## API (GET)

- GET /api/kpis — resumo de KPIs agregados
- GET /api/leaders?company=&track=&promoted= — lista de líderes com filtros
- GET /api/okrs — lista de OKRs com owner
- GET /api/experiments/ab — resultados sintéticos do A/B de mentoria

Exemplo `/api/kpis`:
```json
{
  "promotionPctWithin12m": 35,
  "avgMonthsToPromotion": 8.1,
  "avgSessionNps": 8.2,
  "mentoringEngagementRate": 40,
  "avgOkrProgressByQuarter": [{"quarter":"2025-Q2","progress":0.62}],
  "promotionsByTrack": [{"track":"ENGENHARIA","count":18}]
}
```



