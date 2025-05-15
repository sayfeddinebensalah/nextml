# Use a base Python 3.10 image
FROM python:3.10-slim

# Set environment vars
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set working directory inside container
WORKDIR /app

# Install system dependencies needed for some ML libs
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    ffmpeg \
    libsndfile1 \
 && apt-get clean

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy project files
COPY . /app/

# Collect static files (for Django admin)
RUN python manage.py collectstatic --noinput

# Run app with gunicorn (faster than runserver)
CMD ["gunicorn", "mlaas_main.wsgi:application", "--bind", "0.0.0.0:8000"]
