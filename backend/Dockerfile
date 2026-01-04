FROM python:3.12-slim

WORKDIR /app

# Install uv for faster dependency management
RUN pip install uv

# Copy dependency files first
COPY pyproject.toml ./

# Install dependencies using uv
RUN uv pip install --system --no-cache .

# Copy ALL application code including alembic files
COPY . .

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]