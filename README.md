# EventBoard

Prueba técnica — **Opción A**: aplicación full-stack para gestionar eventos internos de un equipo.

## Stack

- **Backend**: NestJS + MongoDB (Mongoose)
- **Frontend**: React + TypeScript (Vite)
- **Base de datos**: MongoDB 7 (Docker)
- **Testing**: Jest, Supertest, mongodb-memory-server
- **GraphQL**: Apollo Server integrado con NestJS

## Levantar el proyecto

### Con Docker (recomendado)

Solo necesitás Docker instalado:

```bash
docker-compose up --build
```

Esto levanta los tres servicios:

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:4001 |
| Backend | http://localhost:4000 |
| MongoDB | localhost:27020 |

### Sin Docker

Si preferís levantar cada cosa por separado, necesitás tener MongoDB corriendo en el puerto 27020.

```bash
# Backend
cd backend
npm install
npm run start:dev

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev
```

## Tests

```bash
cd backend
npm test
```

Esto corre 22 tests: unitarios del servicio de eventos, unitarios del servicio de auth, e integración de ambos módulos con base de datos en memoria.

Los tests de integración usan `mongodb-memory-server` para no depender de una instancia externa de MongoDB.

## API REST

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | /events | Crear evento | JWT |
| GET | /events | Listar eventos (con filtros opcionales) | No |
| GET | /events/:id | Detalle de un evento | No |
| POST | /auth/register | Registrar usuario | No |
| POST | /auth/login | Iniciar sesión | No |

### Filtros

`GET /events?category=workshop&status=confirmed`

Categorías: `workshop`, `meetup`, `talk`, `social`

Estados: `draft`, `confirmed`, `cancelled`

## GraphQL

Disponible en `http://localhost:4000/graphql` con playground habilitado.

Ejemplo de query:

```graphql
{
  events(category: WORKSHOP) {
    _id
    title
    description
    date
    location
    organizer
    status
  }
}
```

También se puede consultar un evento por ID:

```graphql
{
  event(id: "...") {
    title
    date
    status
  }
}
```

## Decisiones técnicas

**Monorepo**: Elegí tener backend y frontend en el mismo repositorio para simplificar el setup y que quien revise pueda clonar una sola vez y levantar todo.

**MongoDB con Docker**: Usé Docker para la base de datos porque es lo más práctico, no hay que instalar nada extra. Elegí puertos no estándar (4000, 4001, 27020) para evitar conflictos con servicios que ya estén corriendo en la máquina del evaluador.

**Validación**: Usé `class-validator` con `ValidationPipe` global y `whitelist: true` para que NestJS rechace automáticamente campos que no estén en el DTO.

**Testing**: Los tests unitarios mockean el modelo de Mongoose para testear la lógica del servicio aislada. Los tests de integración levantan una instancia real de MongoDB en memoria y hacen requests HTTP con Supertest, incluyendo el flujo de autenticación.

**JWT**: El token se genera en el registro y login, se guarda en localStorage en el frontend, y se envía como Bearer token en las requests que lo necesitan. El organizer del evento se auto-completa con el nombre del usuario logueado.

**GraphQL**: Agregué un endpoint GraphQL que reutiliza el mismo `EventsService` que usa la API REST. No dupliqué lógica, los resolvers simplemente llaman al servicio existente.

## Deseables implementados

- **GraphQL** con Apollo Server — queries de eventos con filtros
- **JWT** — registro, login, guard en endpoints de escritura
- **Docker** — docker-compose.yml que levanta todo el entorno
- **Testing avanzado** — tests unitarios e integración para ambos módulos (events + auth), Supertest, mongodb-memory-server
- **CI/CD** — GitHub Actions que corre los tests en cada push

## Micro-frontends

No implementé una arquitectura de micro-frontends porque para una aplicación de este tamaño sería over-engineering. Pero si el proyecto creciera, el approach sería:

Usaría **Module Federation** (disponible en Webpack 5 y en Vite con `@originjs/vite-plugin-federation`) para dividir la app en módulos independientes:

- **Shell**: aplicación host que maneja el layout, routing y autenticación
- **Events**: micro-frontend con el listado, filtros y detalle de eventos
- **EventForm**: micro-frontend con la creación y edición de eventos

Cada micro-frontend se buildea y deployea de forma independiente. El shell los carga en runtime vía Module Federation, compartiendo dependencias comunes (React, React DOM) para no duplicar bundles.

La ventaja principal es que equipos distintos pueden trabajar en features diferentes sin pisarse, y deployear sin coordinar releases. El trade-off es la complejidad de setup inicial y la necesidad de manejar versionado de dependencias compartidas.

## Qué mejoraría con más tiempo

- Agregar paginación en el listado de eventos
- Implementar edición y eliminación de eventos
- Agregar un endpoint para que cada usuario vea solo sus eventos
- Mejorar el manejo de errores en el frontend con mensajes más específicos
- Agregar un coverage report al CI
