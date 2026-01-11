# ...existing code...
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# install native build deps needed by mysqlclient and other packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential pkg-config default-libmysqlclient-dev libpq-dev \
    libffi-dev libssl-dev zlib1g-dev libjpeg-dev gcc \
    rustc cargo \
  && rm -rf /var/lib/apt/lists/*

# ensure pip/setuptools/wheel are recent
RUN pip install --upgrade pip setuptools wheel

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONPATH=/app

EXPOSE 8000

CMD ["gunicorn", "school_backend.wsgi:application", "--bind", "0.0.0.0:8000"]
# ...existing code...