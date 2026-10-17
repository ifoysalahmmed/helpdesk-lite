# helpdesk-lite

A small helpdesk ticketing REST API built with [NestJS](https://nestjs.com). You can list, filter, create and update support tickets. Only staff can close a ticket.

Tickets are stored **in memory**. The app starts with 20 seed tickets from `src/tickets/tickets.data.ts`, and any change you make is lost when the server restarts.

## Getting started

Requires [Bun](https://bun.sh) (or Node.js 22+ with npm).

```bash
bun install
bun run start:dev
```

The API runs at `http://localhost:3000/api`. To use a different port, create a `.env` file in the project root:

```env
PORT=4000
```

### Scripts

| Command | Description |
|---|---|
| `bun run start` | Start the app |
| `bun run start:dev` | Start in watch mode |
| `bun run start:debug` | Start in watch mode with the debugger attached |
| `bun run build` | Compile to `dist/` |
| `bun run start:prod` | Run the compiled build |
| `bun run lint` | Lint with oxlint |
| `bun run format` | Format with Prettier |

## API

All routes are prefixed with `/api`.

| Method | Route | Description | Auth |
|---|---|---|---|
| `GET` | `/tickets` | List tickets, optionally filtered | — |
| `GET` | `/tickets/:id` | Get one ticket | — |
| `POST` | `/tickets` | Create a ticket | — |
| `PATCH` | `/tickets/:id` | Update a ticket's subject, description or priority | — |
| `PATCH` | `/tickets/:id/close` | Close a ticket | Staff |

### Ticket

```json
{
  "id": 1,
  "subject": "Cannot login to account",
  "description": "User cannot access the dashboard after login",
  "priority": "high",
  "status": "open",
  "createdAt": "2026-09-01T10:00:00.000Z"
}
```

- `priority`: `low` | `medium` | `high`
- `status`: `open` | `closed`

### List tickets

`GET /api/tickets`. These query parameters are optional:

| Param | Values |
|---|---|
| `priority` | `low`, `medium`, `high` |
| `status` | `open`, `closed` |

```bash
curl "http://localhost:3000/api/tickets?priority=high&status=open"
```

### Create a ticket

`POST /api/tickets`. All fields are required. New tickets always start as `open`.

```bash
curl -X POST http://localhost:3000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{"subject": "Printer offline", "description": "3rd floor printer is not responding", "priority": "medium"}'
```

### Update a ticket

`PATCH /api/tickets/:id`. Send any of `subject`, `description` or `priority`. A closed ticket can't be updated and returns `400`.

```bash
curl -X PATCH http://localhost:3000/api/tickets/1 \
  -H "Content-Type: application/json" \
  -d '{"priority": "low"}'
```

### Close a ticket (staff only)

`PATCH /api/tickets/:id/close`. Send the staff key in the `x-staff-key` header. A missing or wrong key returns `403`, and closing a ticket that is already closed returns `400`.

```bash
curl -X PATCH http://localhost:3000/api/tickets/1/close \
  -H "x-staff-key: <staff-key>"
```

The staff key is currently hardcoded in `src/tickets/guards/staff.guard.ts`.

## Responses

Successful responses are wrapped in a success envelope:

```json
{
  "success": true,
  "data": { "id": 1, "subject": "Cannot login to account", "...": "..." }
}
```

Errors use NestJS's default error format:

```json
{
  "message": "Ticket with ID 99 not found",
  "error": "Not Found",
  "statusCode": 404
}
```

### Validation

Request bodies and query parameters are validated globally. Unknown properties are rejected, not silently dropped:

```json
{
  "message": ["property foo should not exist"],
  "error": "Bad Request",
  "statusCode": 400
}
```

An `:id` that isn't an integer also returns `400`.

## Project structure

```
src/
├── main.ts                           # Bootstrap: /api prefix, validation, response interceptor
├── app.module.ts
├── common/
│   ├── request-logger.middleware.ts  # Logs "METHOD /url" for each tickets request
│   └── response.interceptor.ts       # Wraps responses in { success, data }
└── tickets/
    ├── tickets.module.ts
    ├── tickets.controller.ts
    ├── tickets.service.ts            # In-memory ticket store and business rules
    ├── tickets.data.ts               # Seed tickets
    ├── ticket.interface.ts
    ├── dto/                          # Create, update and filter DTOs (class-validator)
    └── guards/
        └── staff.guard.ts            # Checks the x-staff-key header
```
