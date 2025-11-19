#!/bin/bash
# Script para exportar la base de datos PostgreSQL
# Ferretería Alessandro

# Variables (ajustar según tu configuración)
DB_NAME="ferreteria_alessandro_db"
DB_USER="postgres"
DB_HOST="localhost"
DB_PORT="5432"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
OUTPUT_FILE="ferreteria_alessandro_${TIMESTAMP}.sql"

echo "Exportando base de datos ${DB_NAME}..."

# Exportar la base de datos
docker exec -t ferreteria_alessandro_db pg_dump -U ${DB_USER} -d ${DB_NAME} --clean --if-exists > ${OUTPUT_FILE}

if [ $? -eq 0 ]; then
    echo "✓ Base de datos exportada exitosamente: ${OUTPUT_FILE}"
    echo "Puedes enviar este archivo para compartir la base de datos"
else
    echo "✗ Error al exportar la base de datos"
    exit 1
fi
