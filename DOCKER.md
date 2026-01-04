# Docker Setup for Body Fat Tracker

This guide explains how to run the Body Fat Tracker application using Docker and Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0 or higher)

## Quick Start

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd body-fat-tracker
   ```

2. **Create environment file**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update the `SECRET_KEY` for production use:
   ```env
   SECRET_KEY=your-very-secure-secret-key-here
   ```

3. **Build and start all services**:
   ```bash
   docker-compose up --build
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## Services

The application consists of three services:

### PostgreSQL Database
- **Port**: 5432
- **Container**: `bodyfat-db`
- **Volume**: `postgres_data` (persists data between restarts)

### FastAPI Backend
- **Port**: 8000
- **Container**: `bodyfat-backend`
- Automatically runs database migrations on startup

### Next.js Frontend
- **Port**: 3000
- **Container**: `bodyfat-frontend`

## Common Commands

### Start services
```bash
docker-compose up
```

### Start services in background (detached mode)
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### Stop services and remove volumes (⚠️ deletes all data)
```bash
docker-compose down -v
```

### Rebuild services
```bash
docker-compose up --build
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Run database migrations manually
```bash
docker-compose exec backend alembic upgrade head
```

### Access database shell
```bash
docker-compose exec postgres psql -U postgres -d bodyfat_tracker
```

### Access backend shell
```bash
docker-compose exec backend bash
```

## Development with Docker

For development, the docker-compose.yml is configured to:
- Mount source code as volumes (hot-reload enabled)
- Use `--reload` flag for uvicorn (backend auto-restarts on code changes)
- Expose all necessary ports

To develop with live reloading:
```bash
docker-compose up
```

Make changes to your code, and the services will automatically reload.

## Production Deployment

For production, create a separate `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: ${DATABASE_URL}
      SECRET_KEY: ${SECRET_KEY}
      ALGORITHM: ${ALGORITHM}
      ACCESS_TOKEN_EXPIRE_MINUTES: ${ACCESS_TOKEN_EXPIRE_MINUTES}
    depends_on:
      - postgres
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    environment:
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
    depends_on:
      - backend
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
```

Run with:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Port already in use
If you get a "port already allocated" error, either:
- Stop the service using that port
- Change the port mapping in `docker-compose.yml`:
  ```yaml
  ports:
    - "3001:3000"  # Map to different host port
  ```

### Database connection errors
Ensure the database is fully initialized before the backend starts. The healthcheck in docker-compose.yml should handle this, but if issues persist:
```bash
docker-compose restart backend
```

### Permission errors (Linux/Mac)
If you encounter permission issues with volumes:
```bash
sudo chown -R $USER:$USER .
```

### Clear everything and start fresh
```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## Environment Variables

Key environment variables (defined in `.env`):

| Variable | Description | Default |
|----------|-------------|---------|
| `POSTGRES_USER` | PostgreSQL username | postgres |
| `POSTGRES_PASSWORD` | PostgreSQL password | postgres |
| `POSTGRES_DB` | Database name | bodyfat_tracker |
| `DATABASE_URL` | Full database connection string | See .env.example |
| `SECRET_KEY` | JWT secret key | Change in production! |
| `ALGORITHM` | JWT algorithm | HS256 |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration | 30 |
| `NEXT_PUBLIC_API_URL` | Backend API URL for frontend | http://localhost:8000 |

## Health Checks

- **Database**: Built-in healthcheck using `pg_isready`
- **Backend**: Access http://localhost:8000/docs
- **Frontend**: Access http://localhost:3000

## Backup and Restore

### Backup database
```bash
docker-compose exec postgres pg_dump -U postgres bodyfat_tracker > backup.sql
```

### Restore database
```bash
cat backup.sql | docker-compose exec -T postgres psql -U postgres bodyfat_tracker
```

## Support

For issues or questions, please check the main [README.md](README.md) or create an issue in the repository.
