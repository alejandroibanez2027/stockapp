# Prueba Técnica Fullstack 2026

## 1. Descripción del Escenario

### Contexto del problema

La empresa **StockFlow Inc.** necesita una aplicación web para el monitoreo de inventario de productos en tiempo real.

La aplicación debe permitir:

* Consultar el stock actual de productos.
* Recibir alertas cuando el inventario esté por debajo de los mínimos definidos.
* Registrar movimientos (entradas y salidas) de mercancía.

---

### Componentes del sistema

#### inventory-service

Microservicio Spring Boot que expone una API REST para gestionar productos y movimientos de inventario.

#### inventory-app

SPA Angular que consume el microservicio y presenta el dashboard de monitoreo.

#### Requisitos generales

* Comunicación HTTP con manejo de errores.
* Reintentos.
* Degradación elegante.
* Base de datos H2 en memoria.
* Sin configuración externa requerida.

---

### Stack tecnológico

#### Backend

* Java 21
* Spring Boot 3.5+

#### Frontend

* Angular 16+

---

### Entidades de dominio

#### Product

```java
Product {
    id,
    sku,
    name,
    category,
    currentStock,
    minStock,
    unitPrice
}
```

#### Movement

```java
Movement {
    id,
    productId,
    type [IN | OUT],
    quantity,
    reason,
    timestamp
}
```

#### StockAlert

```java
StockAlert {
    productId,
    productName,
    currentStock,
    minStock,
    severity [LOW | CRITICAL]
}
```

---

### Flujo principal

Registrar movimiento de salida:

```text
Movimiento OUT
      ↓
Actualizar stock
      ↓
Verificar mínimo
      ↓
Generar alerta
```

Este flujo end-to-end debe funcionar completamente.

---

# 2. Backend — inventory-service

## 2.1 Endpoints REST obligatorios

| Endpoint                              | Método | Descripción                                            |
| ------------------------------------- | ------ | ------------------------------------------------------ |
| /api/v1/products                      | GET    | Listar productos con paginación y filtro por categoría |
| /api/v1/products/{id}                 | GET    | Obtener detalle de un producto                         |
| /api/v1/movements                     | POST   | Registrar movimiento y actualizar stock                |
| /api/v1/alerts                        | GET    | Retornar productos con stock <= minStock               |
| /api/v1/movements/{productId}/history | GET    | Historial de movimientos                               |

---

## 2.2 Connection Pooling — HikariCP

Configurar explícitamente:

```yaml
maximum-pool-size
minimum-idle
connection-timeout
idle-timeout
```

Requisitos:

* Configuración en application.yml.
* Justificación mediante comentarios.
* Escenario realista de carga media.
* No dejar valores por defecto sin explicación.

---

## 2.3 Resilience4j

### Circuit Breaker

Aplicar sobre:

```http
GET /api/v1/alerts
```

Debe incluir:

* Fallback method.
* Retornar lista vacía.
* Mensaje descriptivo.

---

### Retry

Aplicar al registro de movimientos.

Requisitos:

* Máximo 3 intentos.
* Espera exponencial.

---

### Rate Limiter

Aplicar al historial.

Requisito:

```text
10 peticiones por segundo
```

---

### Restricción

Toda la configuración debe estar en:

```yaml
application.yml
```

No hardcodear valores.

---

## 2.4 Manejo global de excepciones

Implementar:

```java
@RestControllerAdvice
```

Manejar:

| Excepción                       | HTTP |
| ------------------------------- | ---- |
| ProductNotFoundException        | 404  |
| InsufficientStockException      | 422  |
| MethodArgumentNotValidException | 400  |
| Exception                       | 500  |

---

### ErrorResponse

Formato obligatorio:

```json
{
  "timestamp": "",
  "status": 0,
  "error": "",
  "message": "",
  "path": ""
}
```

---

## 2.5 Spring Actuator

Exponer:

```http
/actuator/health
/actuator/metrics
/actuator/info
```

---

### Health Indicator personalizado

Verificar:

```text
Productos en alerta crítica
```

Si más del:

```text
20%
```

está en estado crítico:

```text
DOWN
```

En caso contrario:

```text
UP
```

Mostrar porcentaje actual.

---

### management.info.app

Configurar:

* version
* nombre
* descripción

---

## 2.6 OpenAPI / Swagger

Documentar endpoints usando:

```java
@Operation
@ApiResponse
@Schema
```

---

### Configurar Bean OpenAPI

Debe incluir:

* Contacto
* Licencia
* Servidor

---

### Swagger UI

Disponible en:

```text
/swagger-ui.html
```

Sin autenticación.

---

## 2.7 Validaciones y buenas prácticas

Usar:

```java
@Valid
```

y Bean Validation:

```java
@NotNull
@NotBlank
@Min
@Max
```

---

### Arquitectura

```text
Controller
    ↓
Service
    ↓
Repository
```

No colocar lógica de negocio en controllers.

---

### Datos iniciales

Crear:

```text
data.sql
```

Con:

* mínimo 10 productos
* mínimo 3 categorías

---

## 2.8 Testing

Cobertura mínima:

```text
70%
```

Requisitos:

* Unit Tests
* Integration Tests
* Mocks

Se evaluará:

* Escenarios cubiertos.
* Herramientas utilizadas.
* Calidad de las pruebas.

---

# 3. Frontend — inventory-app

## 3.1 Arquitectura

Todos los componentes deben ser:

```text
Standalone Components
```

---

### Routing

Usar:

```text
Standalone Router
```

con:

```text
Lazy Loading
```

---

### Dependency Injection

Usar:

```typescript
inject()
```

en al menos 3 servicios.

---

## 3.2 Signals

Gestionar estado global mediante:

```typescript
signal()
computed()
effect()
```

---

### InventoryStore

Debe centralizar:

* Productos.
* Alertas.
* Producto seleccionado.
* Estado loading.
* Estado de errores.

---

### Computed Signals

Calcular:

* Total de productos.
* Total de alertas críticas.
* Valor total del inventario.

---

### Effects

Implementar:

#### Persistencia

Guardar filtros activos en:

```text
localStorage
```

#### Notificaciones

Mostrar toast cuando cambien las alertas.

---

## 3.3 Vistas diferidas — @defer

### Historial

Cargar usando:

```typescript
@defer(on interaction)
```

al seleccionar un producto.

---

### Estadísticas avanzadas

Cargar usando:

```typescript
@defer(on viewport)
```

al hacer scroll.

---

### Ambos bloques deben incluir

```typescript
@placeholder
```

Skeleton animado.

```typescript
@loading
```

Spinner centrado.

```typescript
@error
```

Mensaje amigable.

---

## 3.4 Dashboard

### Dashboard

Mostrar KPI Cards:

* Total productos.
* Alertas activas.
* Alertas críticas.
* Valor total inventario.

---

### Listado de productos

Tabla con:

* Filtro por categoría.
* Paginación.
* Badge:

```text
OK
BAJO
CRITICO
```

Calculado en tiempo real.

---

### Panel de alertas

Lista de productos:

* Bajo stock.
* Stock crítico.

Con severidad diferenciada visualmente.

---

### Registro de movimientos

Formulario reactivo:

```typescript
ReactiveFormsModule
```

Con:

* Validación.
* Estado loading.

---

## 3.5 UX

Implementar:

### HTTP Interceptor

Parsear ErrorResponse.

Mostrar toast descriptivo.

---

### Skeleton Loaders

Durante peticiones HTTP.

---

### Botón de envío

Deshabilitar mientras la petición está en curso.

---

# 4. Condiciones de Entrega

## 4.1 Estructura del repositorio

```text
stockflow/
├── inventory-service/
│   ├── src/
│   ├── pom.xml
│   └── README.md
│
├── inventory-app/
│   ├── src/
│   ├── package.json
│   └── README.md
│
└── README.md
```

---

## 4.2 Requisitos de entrega

* Repositorio GitHub o GitLab.
* Commits atómicos.
* Mensajes descriptivos.

---

### Arranque obligatorio

Backend:

```bash
mvn spring-boot:run
```

Frontend:

```bash
npm install
ng serve
```

---

### README raíz

Debe incluir:

* Tiempo invertido por módulo.
* Decisiones técnicas tomadas.

---

### Advertencia

Si el proyecto:

* No compila.
* No arranca.

Obtendrá:

```text
0 puntos
```

en el módulo correspondiente.

---

## 4.3 Defensa

Duración:

```text
60 minutos
```

El candidato debe:

* Ejecutar el proyecto.
* Defender decisiones técnicas.
* Responder preguntas de arquitectura e implementación.

```
```
