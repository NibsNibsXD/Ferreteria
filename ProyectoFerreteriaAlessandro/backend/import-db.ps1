# Script para importar la base de datos PostgreSQL en Windows
# Ferretería Alessandro

param(
    [Parameter(Mandatory=$true)]
    [string]$SqlFile
)

# Variables
$DB_NAME = "ferreteria_alessandro_db"
$DB_USER = "postgres"
$CONTAINER_NAME = "ferreteria_alessandro_db"

if (-not (Test-Path $SqlFile)) {
    Write-Host "✗ Error: El archivo $SqlFile no existe" -ForegroundColor Red
    exit 1
}

Write-Host "Importando base de datos desde $SqlFile..." -ForegroundColor Cyan

# Copiar el archivo SQL al contenedor
docker cp $SqlFile ${CONTAINER_NAME}:/tmp/import.sql

# Importar la base de datos
docker exec -t $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -f /tmp/import.sql

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Base de datos importada exitosamente" -ForegroundColor Green
    # Limpiar archivo temporal
    docker exec -t $CONTAINER_NAME rm /tmp/import.sql
} else {
    Write-Host "✗ Error al importar la base de datos" -ForegroundColor Red
    exit 1
}
