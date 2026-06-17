# StockFlow

Aplicación Fullstack para monitoreo de inventario en tiempo real.

## Estructura

```
stockflow/
├── inventory-service/   → Backend Spring Boot 3.5 + Java 21
├── inventory-app/       → Frontend Angular 21 + PrimeNG 21
└── README.md
```

## Tiempo invertido

| Módulo | Tiempo estimado |
|---|---|
| Backend (inventory-service) | ~8 horas |
| Frontend (inventory-app) | ~10 horas |
| Refactorización y ajustes | ~3 horas |

## Decisiones técnicas

- **Separación de responsabilidades**: arquitectura Controller → Service → Repository + Mappers independientes.
- **Alertas dinámicas**: se calculan en tiempo real desde el servicio (sin tabla en BD).
- **`@Lazy` en mappers**: para romper el ciclo `MovementMapper ↔ ProductMapper` sin rediseñar DTOs.
- **Resilience4j**: Circuit Breaker en `/alerts`, Retry en movimientos, Rate Limiter en historial — toda la configuración en `application.yaml`.
- **Swagger mediante interfaces**: `docs/*Endpoint.java` separan la documentación de los controladores.
- **`@if` vs `[(visible)]`**: dialogs con `@if` para que formularios se reseteen naturalmente al recrearse el componente.
- **`@defer`**: historial con `@defer(on interaction)` para carga lazy del chunk.
- **CORS**: backend permite `http://localhost:4200`, frontend apunta directamente al backend.
- **Angular 21 con PrimeNG 21**: se usó `p-select` en vez de `p-dropdown` (renombrado) y `textarea[pTextarea]` para textarea.
- **Signals**: estado global gestionado con `signal()`, `computed()`, `effect()` en `InventoryStore`.
- **Componente de estadísticas avanzadas no especificado**: Se coloco el listado de top 10 productos con stock bajo, ordenados de manor a mayor utilizando  @defer (on viewport).

## Arranque

```bash
# Backend
cd inventory-service
mvn spring-boot:run

# Frontend
cd inventory-app
npm install
ng serve
```

Backend en `http://localhost:8080`, Frontend en `http://localhost:4200`.

## Docker

### Prerrequisitos

- Docker y Docker Compose instalados.

### Construir y ejecutar

```bash
# Desde la raíz del proyecto
docker compose up --build
```

Esto levanta dos contenedores:

| Servicio | Puerto | URL |
|---|---|---|
| `inventory-service` (backend) | `8080` | `http://localhost:8080` |
| `inventory-app` (frontend) | `80` | `http://localhost:4200` |

> El frontend se sirve con nginx. Las peticiones a `/api/` se redirigen al backend automáticamente, por lo que no hay problemas de CORS en producción.

### Detener

```bash
docker compose down
```

### Construir imágenes individualmente

```bash
# Backend
docker build -t stockflow-backend ./inventory-service

# Frontend
docker build -t stockflow-frontend ./inventory-app
```
